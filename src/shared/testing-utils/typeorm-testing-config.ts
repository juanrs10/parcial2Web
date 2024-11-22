/* eslint-disable prettier/prettier */
/* archivo: src/shared/testing-utils/typeorm-testing-config.ts */
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoEntity } from '../../service/medico.entity/medico.entity';
import { PacienteEntity } from '../../service/paciente.entity/paciente.entity';
import { DiagnosticoEntity } from '../../service/diagnostico.entity/diagnostico.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite', // Usar SQLite en memoria para pruebas
    database: ':memory:',
    dropSchema: true, // Limpiar esquema en cada ejecución
    entities: [MedicoEntity, PacienteEntity, DiagnosticoEntity], // Entidades del proyecto
    synchronize: true, // Sincronizar esquema automáticamente
    keepConnectionAlive: true, // Mantener la conexión activa
  }),
  TypeOrmModule.forFeature([MedicoEntity, PacienteEntity, DiagnosticoEntity]), // Repositorios usados en pruebas
];
/* archivo: src/shared/testing-utils/typeorm-testing-config.ts */
