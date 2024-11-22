/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { MedicoEntity } from '../medico.entity/medico.entity';
import { DiagnosticoEntity } from '../diagnostico.entity/diagnostico.entity';

@Entity()
export class PacienteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  genero: string;

  @ManyToMany(() => MedicoEntity, (medico) => medico.pacientes)
  @JoinTable({
    name: 'paciente_medico', // Tabla intermedia
    joinColumn: { name: 'paciente_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'medico_id', referencedColumnName: 'id' },
  })
  medicos: MedicoEntity[];

  @ManyToMany(() => DiagnosticoEntity, (diagnostico) => diagnostico.pacientes)
  @JoinTable({
    name: 'paciente_diagnostico', // Tabla intermedia
    joinColumn: { name: 'paciente_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'diagnostico_id', referencedColumnName: 'id' },
  })
  diagnosticos: DiagnosticoEntity[];
}
