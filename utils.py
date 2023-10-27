import re

class Validations:
    @staticmethod
    def valida_cpf(cpf):
        if not cpf or len(cpf) != 11:
            return False
        if cpf in [s * 11 for s in (str(n) for n in range(10))]:
            return False
        for i in range(9, 11):
            value = sum(int(a) * b for a, b in zip(cpf[:i], range(i + 1, 1, -1)))
            digit = 11 - (value % 11)
            if digit > 9:
                digit = 0
            if digit != int(cpf[i]):
                return False
        return True

    @staticmethod
    def valida_celular(celular):
        """Valida o formato do número de celular."""
        # A regex abaixo verifica se o número começa com 2 dígitos de DDD seguidos por um 9 e então 8 dígitos.
        pattern = r"^[0-9]{2}9[0-9]{8}$"
        return re.match(pattern, celular) is not None