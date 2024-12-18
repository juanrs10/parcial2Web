import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoEntity } from '../service/diagnostico.entity/diagnostico.entity';
import { DiagnosticoController } from './diagnostico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosticoEntity])],
  providers: [DiagnosticoService],
  exports: [DiagnosticoService],
  controllers: [DiagnosticoController],
})
export class DiagnosticoModule {}
