import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

describe('ProductosService', () => {
  let service: ProductosService;
  let prisma: PrismaService;

  const mockProducto = {
    id: 6,
    nombre: 'Televisor',
    precio: 1000000,
    stock: 5,
  };

  const db = {
    producto: {
      create: jest.fn().mockResolvedValue(mockProducto),
      findMany: jest.fn().mockResolvedValue([mockProducto]),
      findUnique: jest.fn().mockResolvedValue(mockProducto),
      update: jest.fn().mockResolvedValue(mockProducto),
      delete: jest.fn().mockResolvedValue(mockProducto),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('debería crear un producto', async () => {
    const data: Prisma.ProductoCreateInput = {
      nombre: 'Producto Test',
      precio: 1000,
      stock: 5,
    };
    const result = await service.create(data);
    expect(result).toEqual(mockProducto);
    expect(prisma.producto.create).toHaveBeenCalledWith({ data });
  });

  it('debería devolver todos los productos', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockProducto]);
  });

  it('debería devolver un producto por ID', async () => {
    const result = await service.findOne('1');
    expect(result).toEqual(mockProducto);
  });

  it('debería actualizar un producto', async () => {
    const data = { nombre: 'Producto Actualizado' };
    const result = await service.update('1', data);
    expect(result).toEqual(mockProducto);
  });

  it('debería eliminar un producto', async () => {
    const result = await service.remove('1');
    expect(result).toEqual(mockProducto);
  });
});
