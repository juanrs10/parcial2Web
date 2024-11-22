import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceModule } from './service/service.module';
import { DiagnosticoService } from './diagnostico/diagnostico.service';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';
import { PacienteModule } from './paciente/paciente.module';
import { PacienteService } from './paciente/paciente.service';
import { MedicoService } from './medico/medico.service';
import { DiagnosticoService } from './diagnostico/diagnostico.service';

@Module({
  imports: [ServiceModule, PacienteModule, DiagnosticoModule],
  controllers: [AppController],
  providers: [AppService, DiagnosticoService, MedicoService, PacienteService],
})
export class AppModule {}
