import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";

import { Roles } from "../../common/roles.decorator.js";
import { RolesGuard } from "../../common/roles.guard.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { InvoicesService } from "./invoices.service.js";
import { CreateInvoiceDto } from "./dto/create-invoice.dto.js";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto.js";
import { InvoiceQueryDto } from "./dto/invoice-query.dto.js";
import { InvoiceItemDto } from "./dto/invoice-item.dto.js";

@Controller({ path: "invoices", version: "1" })
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @Roles("ADMIN", "VENDEUR")
  create(@Req() req: Request, @Body() payload: CreateInvoiceDto) {
    const user = req.user as { sub?: string } | undefined;
    return this.invoicesService.create(payload, user?.sub);
  }

  @Get()
  @Roles("ADMIN", "VENDEUR")
  findAll(@Query() query: InvoiceQueryDto) {
    return this.invoicesService.findAll(query);
  }

  @Get(":id")
  @Roles("ADMIN", "VENDEUR", "FOURNISSEUR")
  findOne(@Param("id") id: string) {
    return this.invoicesService.findOne(id);
  }

  @Patch(":id")
  @Roles("ADMIN", "VENDEUR")
  update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() payload: UpdateInvoiceDto,
  ) {
    const user = req.user as { sub?: string } | undefined;
    return this.invoicesService.update(id, payload, user?.sub);
  }

  @Delete(":id")
  @Roles("ADMIN")
  remove(@Param("id") id: string, @Req() req: Request) {
    const user = req.user as { sub?: string } | undefined;
    return this.invoicesService.remove(id, user?.sub);
  }

  @Post(":id/items")
  @Roles("ADMIN", "VENDEUR")
  addItem(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() payload: InvoiceItemDto,
  ) {
    const user = req.user as { sub?: string } | undefined;
    return this.invoicesService.addItem(id, payload, user?.sub);
  }

  @Patch("items/:itemId")
  @Roles("ADMIN", "VENDEUR")
  updateItem(
    @Param("itemId") itemId: string,
    @Req() req: Request,
    @Body() payload: InvoiceItemDto,
  ) {
    const user = req.user as { sub?: string } | undefined;
    return this.invoicesService.updateItem(itemId, payload, user?.sub);
  }

  @Delete("items/:itemId")
  @Roles("ADMIN", "VENDEUR")
  removeItem(@Param("itemId") itemId: string, @Req() req: Request) {
    const user = req.user as { sub?: string } | undefined;
    return this.invoicesService.removeItem(itemId, user?.sub);
  }

  @Get(":id/pdf")
  @Roles("ADMIN", "VENDEUR", "FOURNISSEUR")
  async pdf(
    @Param("id") id: string,
    @Query("locale") locale: "fr" | "ar",
    @Res() res: Response,
  ) {
    const pdf = await this.invoicesService.generatePdf(id, locale ?? "fr");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=invoice-${id}.pdf`);
    res.send(pdf);
  }
}
