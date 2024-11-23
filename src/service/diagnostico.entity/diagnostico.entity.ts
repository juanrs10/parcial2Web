/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { PacienteEntity } from '../paciente.entity/paciente.entity';

@Entity()
export class DiagnosticoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: true})
  nombre: string;

  @Column()
  descripcion: string;

  @ManyToMany(() => PacienteEntity, (paciente) => paciente.diagnosticos)
  pacientes: PacienteEntity[];
}
