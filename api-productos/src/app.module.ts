import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { ProductosModule } from './productos/productos.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // hace que las variables .env estén disponibles globalmente
    }),
    ProductosModule, // importa el módulo productos
  ],
  providers: [PrismaService],
})
export class AppModule {}
