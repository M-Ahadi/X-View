from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from django.core.exceptions import ValidationError
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.serialization import load_pem_private_key


class CertificateValidators:
    @staticmethod
    def is_valid_private_key_format(private_key: str):
        private_key = private_key.replace(",", "\n")
        if not (private_key.startswith("-----BEGIN PRIVATE KEY-----") and
                private_key.endswith("-----END PRIVATE KEY-----")):
            raise ValidationError("The private key is not correct!")
        return True

    @staticmethod
    def is_valid_certificate_format(certificate: str):
        certificate = certificate.replace(",", "\n")
        if not (certificate.startswith("-----BEGIN CERTIFICATE-----") and
                certificate.endswith("-----END CERTIFICATE-----")):
            raise ValidationError("The certificate is not correct!")
        return True

    @staticmethod
    def is_valid_private_key(private_key: str):
        try:
            private_key = private_key.replace(",", "\n")
            load_pem_private_key(private_key.encode(), password=None)
            return True
        except ValueError as e:
            raise ValidationError("The private key is not correct!")

    @staticmethod
    def is_valid_certificate(certificate: str):
        try:
            certificate = certificate.replace(",", "\n")
            x509.load_pem_x509_certificate(certificate.encode(), default_backend())
            return True
        except ValueError as e:
            raise ValidationError("The certificate is not correct!")

    @staticmethod
    def private_key_and_certificate_matches(private_key:str, certificates:str):
        private_key = private_key.replace(",", "\n")
        certificates = certificates.replace(",", "\n")

        certificate_index = 0
        key = load_pem_private_key(private_key.encode(), password=None)
        for _ in range(certificates.count("-----BEGIN CERTIFICATE-----")):
            start = certificates.find("-----BEGIN CERTIFICATE-----", certificate_index)
            end = certificates.index("-----END CERTIFICATE-----", certificate_index) + len("-----END CERTIFICATE-----")
            certificate = certificates[start:end]
            certificate_index = end

            cer = x509.load_pem_x509_certificate(certificate.encode(), default_backend())
            key_to_pub = key.public_key().public_bytes(serialization.Encoding.PEM,
                                                       format=serialization.PublicFormat.SubjectPublicKeyInfo)
            cer_to_pub = cer.public_key().public_bytes(serialization.Encoding.PEM,
                                                       format=serialization.PublicFormat.SubjectPublicKeyInfo)

            if key_to_pub.decode("utf-8").replace("\n", "") == cer_to_pub.decode("utf-8").replace("\n", ""):
                return True

        raise ValidationError("Certificate and private key does not match!")
