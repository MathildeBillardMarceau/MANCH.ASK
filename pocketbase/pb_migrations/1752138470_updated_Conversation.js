/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2551737717")

  // update collection data
  unmarshal({
    "name": "conversation"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2551737717")

  // update collection data
  unmarshal({
    "name": "Conversation"
  }, collection)

  return app.save(collection)
})
