import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { createUser } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function createUserResolver(
  root: any,
  args: { email: string },
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const userId = await createUser(args.email, hankoId)
      console.log("user with id created: ", userId)
      if (userId) {
        return userId
      }
      throw new GraphQLError("User already exists")
    }
  } catch (err) {
    console.log(err, "error")
    throw new GraphQLError(JSON.stringify(err))
  }
}
