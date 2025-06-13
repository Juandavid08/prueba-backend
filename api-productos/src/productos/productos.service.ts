import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Producto } from '@prisma/client';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) { }

  create(data: Prisma.ProductoCreateInput): Promise<Producto> {
    return this.prisma.producto.create({ data });
  }

  findAll(): Promise<Producto[]> {
    return this.prisma.producto.findMany();
  }

  findOne(id: string): Promise<Producto | null> {
    return this.prisma.producto.findUnique({
      where: { id: Number(id) as number }, // 👈 solución explícita
    });
  }


  update(id: string, data: Prisma.ProductoUpdateInput): Promise<Producto> {
    return this.prisma.producto.update({
      where: { id: Number(id) }, // ✅ conversión de string a number
      data,
    });
  }

  remove(id: string): Promise<Producto> {
    return this.prisma.producto.delete({
      where: { id: Number(id) }, // ✅ conversión de string a number
    });
  }
}
