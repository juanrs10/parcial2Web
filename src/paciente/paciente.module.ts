import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from '../service/paciente.entity/paciente.entity';
import { MedicoEntity } from '../service/medico.entity/medico.entity';
import { DiagnosticoEntity } from '../service/diagnostico.entity/diagnostico.entity';
import { PacienteController } from './paciente.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PacienteEntity, MedicoEntity, DiagnosticoEntity]),
  ],
  providers: [PacienteService],
  exports: [PacienteService],
  controllers: [PacienteController],
})
export class PacienteModule {}
