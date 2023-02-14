## What's this?
A script to get all accounts' follows and write them to a local DB.

## How to use
1. Install deps and configure the .env file.
`yarn`

2. Run the script for a chosen account:
   - `handle` Lens profile's handle;
   - `ownedBy` Polygon address that holds the handle NFT;
   - `r` recursion level, where 0 will parse follows of the `handle` profile, 1 - follows of the follows, 2 - follows of the follows of the follows... And so on. Beware that you'll likely be banned on the 1st or 2nd level.
`yarn following --handle yoginth --ownedBy 0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3 --r 0`

1. Read result values
`yarn read --handle yoginth`

```
$ ts-node ./src/tasks/read --handle yoginth
[
  'yoginth',
  [
    {
      handle: 'writers',
      ownedBy: '0x279045F9AaD570dE408CEa70F024D52217072ebb'
    },
    {
      handle: 'kwenta',
      ownedBy: '0xC065E02D562cc390F3569305990BFD13B17eEC6B'
    },
    {
      handle: 'honey',
      ownedBy: '0xD746506ff1c4c73A8CaDDF05FAdDc62a31103643'
    },
```