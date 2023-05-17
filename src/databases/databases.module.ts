import { Module } from '@nestjs/common';

import { PrismaService } from '../databases/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
class DatabasesModule {}

export { DatabasesModule };
