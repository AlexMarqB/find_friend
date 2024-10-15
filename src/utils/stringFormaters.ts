
type NoDigitCnpj = string;

type WithDigitCnpj = string;

export class StringFormaters {
    constructor() {}

    validateCnpj(cnpj: string): boolean {
        cnpj = this.formatCnpjStringToNumber(cnpj); // Remove caracteres especiais
    
        if (cnpj.length !== 14) {
            return false; // CNPJ precisa ter 14 dígitos
        }
    
        // Verifica se todos os dígitos são iguais (CNPJs assim são inválidos)
        if (/^(\d)\1+$/.test(cnpj)) {
            return false;
        }
    
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma: number;
        let resultado: number;
        const pesos1: number[] = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const pesos2: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
        // Validação do primeiro dígito verificador
        soma = 0;
        for (let i = 0; i < tamanho; i++) {
            soma += parseInt(numeros.charAt(i)) * pesos1[i];
        }
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != parseInt(digitos.charAt(0))) {
            return false;
        }
    
        // Validação do segundo dígito verificador
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        for (let i = 0; i < tamanho; i++) {
            soma += parseInt(numeros.charAt(i)) * pesos2[i];
        }
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != parseInt(digitos.charAt(1))) {
            return false;
        }
    
        return true; // CNPJ válido
    }

    formatCnpjNumberToString(cnpj: string): WithDigitCnpj {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"); // Adiciona os caracteres especiais
    }

    formatCnpjStringToNumber(cnpj: string): string {
        return cnpj.replace(/\D/g, ""); // Remove todos os caracteres que não são dígitos
    }

    validateCep(cep: string): boolean {
        return /^[0-9]{5}-[0-9]{3}$/.test(cep); // CEP deve ter o formato 00000-000
    }

    formatCepStringToNumber(cep: string): string {
        return cep.replace(/\D/g, ""); // Remove todos os caracteres que não são dígitos
    }

    formatCepNumberToString(cep: string): string {
        return cep.replace(/^(\d{5})(\d{3})$/, "$1-$2"); // Adiciona o caractere especial
    }
}