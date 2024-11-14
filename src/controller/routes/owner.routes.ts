import { FastifyPluginAsync } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { getOwnerByIdSchema, getOwnersSchema, postOwnerSchema } from "../owner.schemas";
import { putPetsToOwnersSchema } from "../pet.schemas";

export const createOwnerRoute: FastifyPluginAsync = async (app) => {
    const appWithTypeProvider = app.withTypeProvider<JsonSchemaToTsProvider>();

    appWithTypeProvider.put(
        '/:ownerId/pets/:petId',
        { schema: putPetsToOwnersSchema },
        async (request) => {
            const { petId, ownerId } = request.params;
            const updated = await app.petService.adopt(petId, ownerId);
            return updated;
        }
    )

    appWithTypeProvider.get(
        '/',
        { schema: getOwnersSchema },
        async () => {
            return await app.ownerService.getAll();
        }
    )

    appWithTypeProvider.get(
        '/:id',
        { schema: getOwnerByIdSchema },
        async (request) => {
            const { id } = request.params;
            return await app.ownerService.getById(id);
        }
    )

    appWithTypeProvider.post(
        '/',
        { schema: postOwnerSchema },
        async (request, reply) => {
            const ownerProps = request.body;
            const created = await app.ownerService.create(ownerProps);
            reply.status(201);
            return created;
        }
    )
}