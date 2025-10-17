import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Product } from "../../domain/entities/product.entity.js";
import { CreateProductDto } from "./dto/create-product.dto.js";
import { UpdateProductDto } from "./dto/update-product.dto.js";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  create(payload: CreateProductDto) {
    const product = this.productsRepository.create(payload);
    return this.productsRepository.save(product);
  }

  findAll() {
    return this.productsRepository.find({ order: { name: "ASC" } });
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return product;
  }

  async update(id: string, payload: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, payload);
    return this.productsRepository.save(product);
  }

  async remove(id: string) {
    const result = await this.productsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException("Product not found");
    }
  }
}
