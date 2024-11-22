import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticoPacienteService } from './diagnostico-paciente.service';
import { DiagnosticoEntity } from '../service/diagnostico.entity/diagnostico.entity';
import { PacienteEntity } from '../service/paciente.entity/paciente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiagnosticoEntity, PacienteEntity]), // Registra las entidades
  ],
  providers: [DiagnosticoPacienteService],
  exports: [DiagnosticoPacienteService], // Opcional, si necesitas usarlo en otros módulos
})
export class DiagnosticoPacienteModule {}
