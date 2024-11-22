/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacienteModule } from './paciente/paciente.module';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';
import { PacienteEntity } from './service/paciente.entity/paciente.entity';
import { MedicoEntity } from './service/medico.entity/medico.entity';
import { DiagnosticoEntity } from './service/diagnostico.entity/diagnostico.entity';
import { MedicoModule } from './medico/medico.module';
import { DiagnosticoPacienteModule } from './diagnostico-paciente/diagnostico-paciente.module';
import { MedicoPacienteModule } from './medico-paciente/medico-paciente.module';

@Module({
  imports: [
    PacienteModule,
    MedicoModule,
    DiagnosticoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'medicine',
      entities: [PacienteEntity, MedicoEntity, DiagnosticoEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    DiagnosticoPacienteModule,
    MedicoPacienteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
