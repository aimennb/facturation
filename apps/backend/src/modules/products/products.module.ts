import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProductsController } from "./products.controller.js";
import { ProductsService } from "./products.service.js";
import { Product } from "../../domain/entities/product.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
