import { FastifyPluginAsync } from "fastify";
import { getPetByIdSchema, getPetsSchema, postPetsSchema } from "../pet.schemas";
import { PetService } from "../../service/pet.service";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";

type PluginOption = {
    petService: PetService
}

export const createPetRoute: FastifyPluginAsync<PluginOption> = async (app, { petService }) => {
    const appWithTypeProvider = app.withTypeProvider<JsonSchemaToTsProvider>();
    
    appWithTypeProvider.get(
    '/', 
    { schema: getPetsSchema }, 
    async () => {
        const pets = await petService.getAll();
        return pets;
    });

    appWithTypeProvider.get(
    '/:id',
    { schema: getPetByIdSchema },
    async (request) => {
        const { id } = request.params;
        const pets = await petService.getById(id);
        return pets;
    })

    appWithTypeProvider.post(
    '/',
    { schema: postPetsSchema },
    async (request, reply) => {
      const { body: petToCreate } = request;

      const created = await petService.create(petToCreate);
      reply.status(201);
      return created;
    })
}