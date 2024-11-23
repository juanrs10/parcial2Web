import { Module } from '@nestjs/common';
import { MedicoController } from './medico.controller';
import { MedicoEntity } from 'src/service/medico.entity/medico.entity';
import { MedicoService } from './medico.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MedicoEntity])],
  providers: [MedicoService],
  exports: [MedicoService],
  controllers: [MedicoController],
})
export class MedicoModule {}
