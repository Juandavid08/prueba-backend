import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Producto } from '@prisma/client';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProductoCreateInput): Promise<Producto> {
    try {
      return await this.prisma.producto.create({ data });
    } catch (error) {
      this.handlePrismaError(error, 'crear');
    }
  }

  async findAll(): Promise<Producto[]> {
    try {
      return await this.prisma.producto.findMany();
    } catch (error) {
      this.handlePrismaError(error, 'listar');
    }
  }

  async findOne(id: string): Promise<Producto> {
    try {
      const producto = await this.prisma.producto.findUnique({
        where: { id: Number(id) },
      });

      if (!producto) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      return producto;
    } catch (error) {
      this.handlePrismaError(error, 'buscar');
    }
  }

  async update(id: string, data: Prisma.ProductoUpdateInput): Promise<Producto> {
    try {
      return await this.prisma.producto.update({
        where: { id: Number(id) },
        data,
      });
    } catch (error) {
      this.handlePrismaError(error, 'actualizar', id);
    }
  }

  async remove(id: string): Promise<Producto> {
    try {
      return await this.prisma.producto.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      this.handlePrismaError(error, 'eliminar', id);
    }
  }

  private handlePrismaError(error: any, accion: string, id?: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`No se pudo ${accion} el producto${id ? ` con ID ${id}` : ''}: no existe.`);
      }

      if (error.code === 'P2002') {
        throw new BadRequestException(`Error al ${accion}: ya existe un producto con ese valor único.`);
      }
    }

    console.error(`Error al ${accion} producto:`, error);
    throw new InternalServerErrorException(`Error interno al ${accion} producto.`);
  }
}
