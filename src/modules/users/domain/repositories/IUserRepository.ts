import { ICreateUserDTO } from "../../infra/dtos/ICreateUserDTO";
import { IDeleteUserDTO } from "../../infra/dtos/IDeleteUserDTO";
import { UserEntity } from "../entities/UserEntity";

interface IUserRepository {
  create({ email, password }: ICreateUserDTO): Promise<void>;
  delete({ id }: IDeleteUserDTO): Promise<void>;
  findByEmail(email: string): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity>;
};

export { IUserRepository };