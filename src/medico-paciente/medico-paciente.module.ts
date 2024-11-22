import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from '../service/paciente.entity/paciente.entity';
import { MedicoEntity } from '../service/medico.entity/medico.entity';
import { MedicoPacienteService } from './medico-paciente.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicoEntity, PacienteEntity]), // Registra las entidades
  ],
  providers: [MedicoPacienteService],
  exports: [MedicoPacienteService], // Opcional, si necesitas usarlo en otros módulos
})
export class MedicoPacienteModule {}
