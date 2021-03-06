import { IosClientBrandingAttributes } from "aws-sdk/clients/workspaces";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IDeleteObjectDTO } from "../../dtos/IDeleteObjectDTO";
import { IObjectRepository } from "../../repositories/IObjectsRepository";

@injectable()
class DeleteObjectUseCase {
  constructor(
    @inject("ObjectsRepository")
    private objectsRepository: IObjectRepository
  ) { }

  async execute({ object_id, user_id }: IDeleteObjectDTO): Promise<void> {
    const objectExists = await this.objectsRepository.findById(object_id);

    if (!objectExists) {
      throw new AppError("Object doesn't exists");
    }

    if (objectExists.user_id != user_id) {
      throw new AppError("You haven't created this object", 403);
    }

    await this.objectsRepository.delete({ object_id });
  }
}

export { DeleteObjectUseCase };