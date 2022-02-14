# Take-home Exercise

## Introduction
The idea of this exercise is to set up a server that performs certain analysis and generates metrics about the behaviour of our users in the Metaverse. In particular, we want to study how certain users move around the world. Decentraland's Metaverse is composed of parcels, each identified with a couple of integers. For example: [0, 0], [10, 20], [150, -150], etc. The user tracker will not know the exact location of each user, but only in which parcel they are. For the purposes of this exercise, we will assume that the amount of concurrent users is ~2000.

## What is already there?
There is already a server provided, built in Typescript, with and endpoint that allows clients to establish a friendship relation between two users. This endpoint also stores this relation in a database. Users are identified by their [Ethereum addresses](https://hackernoon.com/how-to-generate-ethereum-addresses-technical-address-generation-explanation-25r3zqo).

See [server/README.md](server/README.md) for more details.

## What you need to do
You will need to add some new endpoints so that our server can receive data about the users and expose the calculated metrics.

### 1. Receive updates
We need a new endpoint (`POST /users-update`) to receive position updates about our users. This endpoint will receive the following body:
```ts
{
  moved: { id: EthAddress, position: { x: number, y: number } }[],
  disconnected: EthAddress[]
}
```
Where `moved` are the users identified by their Ethereum Address that connected to the Metaverse or changed position. While `disconnected` are the users that were online but left and they are no longer connected to any parcel.

This endpoint will be called every minute, with all updates that happened during that interval. Each id will only appear once in the payload.

### 2. Friendship suggestion
We would like to add a new feature to our Decentraland client, where we suggest new friendships to our users. The idea would be that if there is a "friendship connection" between two users that are not already friends and all members of that connection were in the same parcel some time in the last 2 hours, we will suggest that they become friends.

By "friendship connection" we refer to a scenario where A is friends with B, B is friends with C and C is friends with D. In this case, there is a friendship connection between A and D. There isn't a minimum length for a connection to be valid. As long as there is one, and the two ends of the connection are not friends, then we want to perform the suggestion.

In order to enable this feature, we want to expose a new endpoint `GET /suggest-friendship/:user1/:user2` where given a two users, we will return the following body:
```ts
{
  shouldSuggest: boolean
}
```

For example, being `t1 < t2 < t3` and `t1 > now - 2h`:

If the positions of users `address1, address2, address3` were:

*t1*
```
address1 connects in parcel (0,0)
```


*t2*
```
address1 moves to parcel (0,1)
address2 connects in parcel (0,0)
```


*t3*
```
address3 connects in parcel (0,0)
address2 disconnects
```

Then when asking if `shouldSuggestFriendship(address1, address3)` it must return true: Eventhough they weren't together in the same parcel (0,0) at the same time, they all have been there in the last two hours.

