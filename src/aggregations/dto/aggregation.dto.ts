export class ApplyEntityDto {
    keys: {
        [name: string]: any | never
    }

    values: {
        [name: string]: any | never
    }
}

export class ApplyRecordDto {
    source: ApplyEntityDto
    target: ApplyEntityDto
}

export class ApplyDto {
    dataSource: string
    records: ApplyRecordDto[]
    issuerId: string
}

export class MovementDto {
    issuerId: string
    dataSource: string
    source: ApplyEntityDto
    target: ApplyEntityDto
}

export class HistoryDto extends ApplyEntityDto {
    issuerId: string
    dataSource: string
}