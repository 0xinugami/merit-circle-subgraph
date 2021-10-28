import { BigInt } from "@graphprotocol/graph-ts"
import {
  Transfer
} from "../generated/MeritCircleToken/MeritCircleToken"
import { User } from "../generated/schema"


export function handleTransfer(event: Transfer): void {
  const from = event.params.from.toHex()
  let userFrom = User.load(from)
  if (userFrom == null) {
    userFrom = createNewUser(from, from)
  }
  userFrom.balance = userFrom.balance.minus(event.params.value)
  userFrom.transactionCount = userFrom.transactionCount + 1
  userFrom.save()

  const to = event.params.to.toHex();
  let userTo = User.load(to);
  if (userTo == null) {
    userTo = createNewUser(to, to)
  }
  userTo.balance = userTo.balance.plus(event.params.value)
  userTo.transactionCount = userTo.transactionCount + 1
  userTo.save()
}

function createNewUser(id: string, address: string): User {
  let user = new User(id);
  user.address = address
  user.balance = BigInt.fromI32(0)
  user.transactionCount = 0
  return user
}