import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticoService } from './diagnostico.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiagnosticoService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
