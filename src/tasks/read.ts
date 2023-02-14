import minimist from 'minimist'
import { Level } from 'level'

const db = new Level<string, any>('./db', { valueEncoding: 'json' })

const read = async (handle: string) => {
  const all = await db.iterator().all()

  console.log(all.find(profile => profile[0] === handle))
}

(async () => {
  const argv = minimist(process.argv.slice(2), { string: ['handle'] })
  if (!argv.handle) throw Error('Missing arguments')

  await read(argv.handle)
})()