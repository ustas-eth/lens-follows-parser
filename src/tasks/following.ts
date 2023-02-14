import config from '../config.json'
import minimist from 'minimist'
import { Level } from 'level'
import { apolloClient } from '../apollo-client'
import { FollowingDocument, FollowingRequest } from '../graphql/generated'

const db = new Level<string, any>('./db', { valueEncoding: 'json' })

const followingRequest = async (request: FollowingRequest) => {
  const result = await apolloClient.query({
    query: FollowingDocument,
    variables: {
      request,
    },
  })

  return result.data.following
}

const following = async (initial: { handle: string, ownedBy: string }, r: number = 0) => {
  if (r >= 0) {
    let list: Array<{ handle: string, ownedBy: string }> = []
    let cursor = '{"offset": 0}'

    while (true) {
      const result = await followingRequest({ address: initial.ownedBy, limit: 50, cursor })

      if (result.pageInfo.next === null) break

      cursor = result.pageInfo.next
      list = [...list, ...result.items.map(i => { return { handle: i.profile.handle.split('.')[0], ownedBy: i.profile.ownedBy } })]
    }

    console.log(`Put ${initial.handle}`)
    await db.put(initial.handle, list)

    for (const profile of list) {
      db.get(profile.handle).catch(async (err) => {
        if (err.code === 'LEVEL_NOT_FOUND') {
          require('timers/promises').setTimeout(500)
          await following(profile, r - 1)
        }
        else throw err
      })
    }
  }
}

(async () => {
  const argv = minimist(process.argv.slice(2), { string: ['handle', 'ownedBy'] })
  if (!argv.handle || !argv.ownedBy) throw Error('Missing arguments')

  await following({ handle: argv.handle, ownedBy: argv.ownedBy }, parseInt(argv.r) || 0)
})()
