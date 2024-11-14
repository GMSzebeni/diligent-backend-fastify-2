import { FastifyPluginAsync } from "fastify";
import { OwnerService } from "../../service/owner.service";
import { PetService } from "../../service/pet.service";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { getOwnerByIdSchema, getOwnersSchema, postOwnerSchema } from "../owner.schemas";
import { putPetsToOwnersSchema } from "../pet.schemas";

type PluginOption = {
    ownerService: OwnerService,
    petService: PetService
}

export const createOwnerRoute: FastifyPluginAsync<PluginOption> = async (app, { petService, ownerService }) => {
    const appWithTypeProvider = app.withTypeProvider<JsonSchemaToTsProvider>();

    appWithTypeProvider.put(
        '/:ownerId/pets/:petId',
        { schema: putPetsToOwnersSchema },
        async (request) => {
            const { petId, ownerId } = request.params;
            const updated = await petService.adopt(petId, ownerId);
            return updated;
        }
    )

    appWithTypeProvider.get(
        '/',
        { schema: getOwnersSchema },
        async () => {
            return await ownerService.getAll();
        }
    )

    appWithTypeProvider.get(
        '/:id',
        { schema: getOwnerByIdSchema },
        async (request) => {
            const { id } = request.params;
            return await ownerService.getById(id);
        }
    )

    appWithTypeProvider.post(
        '/',
        { schema: postOwnerSchema },
        async (request, reply) => {
            const ownerProps = request.body;
            const created = await ownerService.create(ownerProps);
            reply.status(201);
            return created;
        }
    )
}