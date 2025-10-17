import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as argon2 from "argon2";
import { Repository } from "typeorm";

import { CreateUserDto } from "./dto/create-user.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { User } from "../../domain/entities/user.entity.js";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(payload: CreateUserDto): Promise<User> {
    const passwordHash = await argon2.hash(payload.password);
    const user = this.usersRepository.create({
      email: payload.email.toLowerCase(),
      passwordHash,
      fullName: payload.fullName,
      role: payload.role,
      supplierId: payload.supplierId,
    });
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ["supplier"] });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ["supplier"],
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async update(id: string, payload: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (payload.password) {
      user.passwordHash = await argon2.hash(payload.password);
    }
    if (payload.email) {
      user.email = payload.email.toLowerCase();
    }
    if (payload.fullName !== undefined) {
      user.fullName = payload.fullName;
    }
    if (payload.role) {
      user.role = payload.role;
    }
    if (payload.supplierId !== undefined) {
      user.supplierId = payload.supplierId;
    }
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException("User not found");
    }
  }
}
