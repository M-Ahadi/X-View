from django.core.exceptions import ValidationError
from django.test import TestCase

from .models import Certificate
from .validators import CertificateValidators


class CertificateTestCase(TestCase):
    def setUp(self):
        Certificate.objects.create(
            name="good_certificate",
            certificate="-----BEGIN CERTIFICATE-----,MIIB/DCCAWWgAwIBAgIUVwRGhUaCGCiLaccS2obd4yCo6XEwDQYJKoZIhvcNAQEL,BQAwEDEOMAwGA1UEAwwFeHZpZXcwHhcNMjMwNDI3MTIwNDUyWhcNMzMwNDI0MTIw,NDUyWjAQMQ4wDAYDVQQDDAV4dmlldzCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkC,gYEAxooxOjWPo7pKbUn2qIEx/OY6AChUrEsXR9S+cVrmli2Ny30S+3bLL4YZf8bK,H0i3GDMb3hZXMslMCiaoGW86BXJUFaX8xvGB1Lp4Uy1Ai8xvMqQT4RzUsx3KbtaL,4evk/wMrGJ0PyRJsp7pVaEIggZFGxmaTaIUOFEi4iQcK51ECAwEAAaNTMFEwHQYD,VR0OBBYEFDu8XSbdQlGCLkSXZrBzB+Vng8dUMB8GA1UdIwQYMBaAFDu8XSbdQlGC,LkSXZrBzB+Vng8dUMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADgYEA,ODsb6W7UToSjDbceN9S99kywD56Kuu/1BiXy8kJOn4bM/bRoi4IEtTL/M//q3qJ+,CW0IDSo0RWOzM+/yktgCK/unk/f+LJwePUSpq5vKeEpnD43liLRL+alo6wzfbD3A,pEYTL10Nvuf+KAse1zGY6j73CyV+NfF0sZ1ZQ0siXCE=,-----END CERTIFICATE-----",
            privatekey="-----BEGIN PRIVATE KEY-----,MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMaKMTo1j6O6Sm1J,9qiBMfzmOgAoVKxLF0fUvnFa5pYtjct9Evt2yy+GGX/Gyh9ItxgzG94WVzLJTAom,qBlvOgVyVBWl/MbxgdS6eFMtQIvMbzKkE+Ec1LMdym7Wi+Hr5P8DKxidD8kSbKe6,VWhCIIGRRsZmk2iFDhRIuIkHCudRAgMBAAECgYEAvgVjykebO+Q/+cvxtSM6OcgM,OTxgliqklI5s28dZrODatqj18xGmtMyPOTmFGF4bR6EbCfut56C8E3ceKoHHL+GK,+3cVT44ItTqoveOh7FEJ4KoIwYiIx+PeBYzQqdz6GGs/vCW5/ojheyEq1FRjKvBY,G8qt8XmOH8hLoYsqLQUCQQDpEzt1NWk5y+IZYb927ihmC4rbq+1/YrrrYN/wCV2k,Shl9p7B9Kfw95fMLooi82B0QInBpDtC7nvSz5V3YIOtbAkEA2hFezusIuyy4jP3w,o1Dh6qOghLplUrksoo8RWyLq4IglOrXh+nJux/KSFBUoOm340SwOoz6dO72qr9l/,2+WzwwJAX4vEyg21Lz5HV8RcavLCmOKOb/MRDzF4EtnJs2sDej/uJzbBAO5fOziy,48gjadbmQyD7F/Y8100YX07do6YLFQJARWZLzvxb3f3AihZzE/a0v1Dtz+/mOSp3,exCfDGsTZvvNJV8nGOZ8PSQEu2F0WQwQqLklu2w86/tTq/1DRL9YswJAX7uPv5n7,7uWQ8B7jFluzMHeApLMSZkWsrnusBSgJj4H0AgdhlSSUbgVIJwcNmwq4HY6toq5f,mEEWA7RwxOIlBg==,-----END PRIVATE KEY-----"
        )

        Certificate.objects.create(
            name="bad_certificate",
            certificate="MIIB/DCCAWWgAwIBAgIUVwRGhUaCGCiLaccS2obd4yCo6XEwDQYJKoZIhvcNAQEL,BQAwEDEOMAwGA1UEAwwFeHZpZXcwHhcNMjMwNDI3MTIwNDUyWhcNMzMwNDI0MTIw,NDUyWjAQMQ4wDAYDVQQDDAV4dmlldzCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkC,gYEAxooxOjWPo7pKbUn2qIEx/OY6AChUrEsXR9S+cVrmli2Ny30S+3bLL4YZf8bK,H0i3GDMb3hZXMslMCiaoGW86BXJUFaX8xvGB1Lp4Uy1Ai8xvMqQT4RzUsx3KbtaL,4evk/wMrGJ0PyRJsp7pVaEIggZFGxmaTaIUOFEi4iQcK51ECAwEAAaNTMFEwHQYD,VR0OBBYEFDu8XSbdQlGCLkSXZrBzB+Vng8dUMB8GA1UdIwQYMBaAFDu8XSbdQlGC,LkSXZrBzB+Vng8dUMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADgYEA,ODsb6W7UToSjDbceN9S99kywD56Kuu/1BiXy8kJOn4bM/bRoi4IEtTL/M//q3qJ+,CW0IDSo0RWOzM+/yktgCK/unk/f+LJwePUSpq5vKeEpnD43liLRL+alo6wzfbD3A,pEYTL10Nvuf+KAse1zGY6j73CyV+NfF0sZ1ZQ0siXCE=",
            privatekey="MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMaKMTo1j6O6Sm1J,9qiBMfzmOgAoVKxLF0fUvnFa5pYtjct9Evt2yy+GGX/Gyh9ItxgzG94WVzLJTAom,qBlvOgVyVBWl/MbxgdS6eFMtQIvMbzKkE+Ec1LMdym7Wi+Hr5P8DKxidD8kSbKe6,VWhCIIGRRsZmk2iFDhRIuIkHCudRAgMBAAECgYEAvgVjykebO+Q/+cvxtSM6OcgM,OTxgliqklI5s28dZrODatqj18xGmtMyPOTmFGF4bR6EbCfut56C8E3ceKoHHL+GK,+3cVT44ItTqoveOh7FEJ4KoIwYiIx+PeBYzQqdz6GGs/vCW5/ojheyEq1FRjKvBY,G8qt8XmOH8hLoYsqLQUCQQDpEzt1NWk5y+IZYb927ihmC4rbq+1/YrrrYN/wCV2k,Shl9p7B9Kfw95fMLooi82B0QInBpDtC7nvSz5V3YIOtbAkEA2hFezusIuyy4jP3w,o1Dh6qOghLplUrksoo8RWyLq4IglOrXh+nJux/KSFBUoOm340SwOoz6dO72qr9l/,2+WzwwJAX4vEyg21Lz5HV8RcavLCmOKOb/MRDzF4EtnJs2sDej/uJzbBAO5fOziy,48gjadbmQyD7F/Y8100YX07do6YLFQJARWZLzvxb3f3AihZzE/a0v1Dtz+/mOSp3,exCfDGsTZvvNJV8nGOZ8PSQEu2F0WQwQqLklu2w86/tTq/1DRL9YswJAX7uPv5n7,7uWQ8B7jFluzMHeApLMSZkWsrnusBSgJj4H0AgdhlSSUbgVIJwcNmwq4HY6toq5f,mEEWA7RwxOIlBg=="
        )

        Certificate.objects.create(
            name="not_matched",
            certificate="-----BEGIN CERTIFICATE-----,MIIB/DCCAWWgAwIBAgIUVwRGhUaCGCiLaccS2obd4yCo6XEwDQYJKoZIhvcNAQEL,BQAwEDEOMAwGA1UEAwwFeHZpZXcwHhcNMjMwNDI3MTIwNDUyWhcNMzMwNDI0MTIw,NDUyWjAQMQ4wDAYDVQQDDAV4dmlldzCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkC,gYEAxooxOjWPo7pKbUn2qIEx/OY6AChUrEsXR9S+cVrmli2Ny30S+3bLL4YZf8bK,H0i3GDMb3hZXMslMCiaoGW86BXJUFaX8xvGB1Lp4Uy1Ai8xvMqQT4RzUsx3KbtaL,4evk/wMrGJ0PyRJsp7pVaEIggZFGxmaTaIUOFEi4iQcK51ECAwEAAaNTMFEwHQYD,VR0OBBYEFDu8XSbdQlGCLkSXZrBzB+Vng8dUMB8GA1UdIwQYMBaAFDu8XSbdQlGC,LkSXZrBzB+Vng8dUMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADgYEA,ODsb6W7UToSjDbceN9S99kywD56Kuu/1BiXy8kJOn4bM/bRoi4IEtTL/M//q3qJ+,CW0IDSo0RWOzM+/yktgCK/unk/f+LJwePUSpq5vKeEpnD43liLRL+alo6wzfbD3A,pEYTL10Nvuf+KAse1zGY6j73CyV+NfF0sZ1ZQ0siXCE=,-----END CERTIFICATE-----",
            privatekey="-----BEGIN PRIVATE KEY-----,MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBANVgFRgxa6iXanwD,D5RtiBTyef4uNuqfGlJzHoiBIaAzemsrkXthyDJ51IMbCBSQJfeuwD4auUGXcuyv,o/KMUwqwfC/+Nh2u0gJLffukfMzbImGJq/DxPS6GCOek4qKCeyW+C5/iqSrlDVqt,WYDulAHGqV4zFv9Sj+VKPuQ+mAoRAgMBAAECgYA2LS8t9V5gcBGZay2JgkYLC4Xu,A83txHfqd1BJWIAxLODoVSebLDiomEZdA4AJuI/rU3N8UUy4WrvTXMVD0F1E4qAE,7pPvqCdiBzOccmHf+yG9LIhmCXFxnmjwUpimp6HabwoxNf5SFA12XWguPIJalAOm,JIAHvIVjCYIx/erwAQJBAPjIUjwBGRCq2aytxl80eQ+xIyQNhKckNvIbExxHhAUm,bGAoeGOAh9C+VkpM5wgnqI3YxJaBRLQRFQfuzvA3zrUCQQDbkMvPm/AAQpI9/POz,ldRVQxXO4w92C0IqKqZTTHQlkb0LmcvstFQHBf7N5wG0ceaplKDe85JNjhTz9JVN,7kttAkEA2WtgivY+rJVT1RitpCicoH0jg++YfeYlauMEiZNqqoGQ91yHEhaTG3gs,u5SH2FWodgb6j7n7jA7dvWgUTFXJfQJAUn8lFOxSUMayi/fu2RsCnMaH+yP1OzUf,txgvRj0DptoLXcB7joRyzfDCvDp/uXzSXgUqLJr37Yvk84SCVLWkQQJBAIXUlfRx,P4qOZ5lSfnKWNOxty/pGcJeY2Ox63nrYuYsn4f7dDp+oZL3iwS6VSiTYfSegHXnt,SJ/x7gGWdOEh92E=,-----END PRIVATE KEY-----"
        )
        Certificate.objects.create(
            name="chain",
            certificate="-----BEGIN CERTIFICATE-----,MIIEXzCCA0egAwIBAgISBBXQL9XThatzX81X/IkM3SKMMA0GCSqGSIb3DQEBCwUA,MDIxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MQswCQYDVQQD,EwJSMzAeFw0yMzAzMjcwNzQ5MDZaFw0yMzA2MjUwNzQ5MDVaMBcxFTATBgNVBAMM,DCoubS1haGFkaS5pcjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABBtbdpbo9wwS,gGGMkYxKyoraLnZckn/xzUeMoRQfvnKfNbqZGEysGDAlXclnEkB5IWBECYKDKRxX,SwpC4zJ0FWCjggJTMIICTzAOBgNVHQ8BAf8EBAMCB4AwHQYDVR0lBBYwFAYIKwYB,BQUHAwEGCCsGAQUFBwMCMAwGA1UdEwEB/wQCMAAwHQYDVR0OBBYEFMWawjpNHFeM,l6Hnt/47PiFpBJb9MB8GA1UdIwQYMBaAFBQusxe3WFbLrlAJQOYfr52LFMLGMFUG,CCsGAQUFBwEBBEkwRzAhBggrBgEFBQcwAYYVaHR0cDovL3IzLm8ubGVuY3Iub3Jn,MCIGCCsGAQUFBzAChhZodHRwOi8vcjMuaS5sZW5jci5vcmcvMCMGA1UdEQQcMBqC,DCoubS1haGFkaS5pcoIKbS1haGFkaS5pcjBMBgNVHSAERTBDMAgGBmeBDAECATA3,BgsrBgEEAYLfEwEBATAoMCYGCCsGAQUFBwIBFhpodHRwOi8vY3BzLmxldHNlbmNy,eXB0Lm9yZzCCAQQGCisGAQQB1nkCBAIEgfUEgfIA8AB2AHoyjFTYty22IOo44FIe,6YQWcDIThU070ivBOlejUutSAAABhyJBvXUAAAQDAEcwRQIgSS4wgQ7qPfcovMlj,gZbZlBrkgHFVYgeTIPbwRN6bN6kCIQCbQVLaEt0VS8xQ9JgjUVr6jd9xDSfcAk+z,V9C6lRD94AB2AK33vvp8/xDIi509nB4+GGq0Zyldz7EMJMqFhjTr3IKKAAABhyJB,vaAAAAQDAEcwRQIgPtfYApPef1SaObv85Xgzy+gjheDByF0rA6olNHqFjCsCIQDD,KWgdo1iF+YXAyS6ZHWb5QxbJVVE/2ZcJbKksKOTkkTANBgkqhkiG9w0BAQsFAAOC,AQEAG6U2T5JwgF5hVKKeaPhBkGXl20QcGPGhSvVfUuqP0wyyMHFKma7WP7wwJ5sH,UydaiT4AHiUAvQtcIHdUfck3dR8GWXOdfi9eGY5wXG53s4TwdS/UKf3C3dq5qJD4,10en3504BTkZxwjtVksw75IOnWvju/XZe+ps65wYocroSQSpqU/kO0JDU0t6u/qR,INmCA29fpeUoPvE/hbF8SaN9wk8YnX9NxxkqVXyXk8DiJ5kKh2btPDBgYOy28qGp,SELTu+z1BwMor4pGIKPPK5qJBuaFY5Iw7C8l4lH3VtLHCCX7wsSmyvdIIaWeJDVY,NzPZxCm6g32Y9GHDFFw0Av0+Xw==,-----END CERTIFICATE-----,-----BEGIN CERTIFICATE-----,MIIFFjCCAv6gAwIBAgIRAJErCErPDBinU/bWLiWnX1owDQYJKoZIhvcNAQELBQAw,TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh,cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMjAwOTA0MDAwMDAw,WhcNMjUwOTE1MTYwMDAwWjAyMQswCQYDVQQGEwJVUzEWMBQGA1UEChMNTGV0J3Mg,RW5jcnlwdDELMAkGA1UEAxMCUjMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK,AoIBAQC7AhUozPaglNMPEuyNVZLD+ILxmaZ6QoinXSaqtSu5xUyxr45r+XXIo9cP,R5QUVTVXjJ6oojkZ9YI8QqlObvU7wy7bjcCwXPNZOOftz2nwWgsbvsCUJCWH+jdx,sxPnHKzhm+/b5DtFUkWWqcFTzjTIUu61ru2P3mBw4qVUq7ZtDpelQDRrK9O8Zutm,NHz6a4uPVymZ+DAXXbpyb/uBxa3Shlg9F8fnCbvxK/eG3MHacV3URuPMrSXBiLxg,Z3Vms/EY96Jc5lP/Ooi2R6X/ExjqmAl3P51T+c8B5fWmcBcUr2Ok/5mzk53cU6cG,/kiFHaFpriV1uxPMUgP17VGhi9sVAgMBAAGjggEIMIIBBDAOBgNVHQ8BAf8EBAMC,AYYwHQYDVR0lBBYwFAYIKwYBBQUHAwIGCCsGAQUFBwMBMBIGA1UdEwEB/wQIMAYB,Af8CAQAwHQYDVR0OBBYEFBQusxe3WFbLrlAJQOYfr52LFMLGMB8GA1UdIwQYMBaA,FHm0WeZ7tuXkAXOACIjIGlj26ZtuMDIGCCsGAQUFBwEBBCYwJDAiBggrBgEFBQcw,AoYWaHR0cDovL3gxLmkubGVuY3Iub3JnLzAnBgNVHR8EIDAeMBygGqAYhhZodHRw,Oi8veDEuYy5sZW5jci5vcmcvMCIGA1UdIAQbMBkwCAYGZ4EMAQIBMA0GCysGAQQB,gt8TAQEBMA0GCSqGSIb3DQEBCwUAA4ICAQCFyk5HPqP3hUSFvNVneLKYY611TR6W,PTNlclQtgaDqw+34IL9fzLdwALduO/ZelN7kIJ+m74uyA+eitRY8kc607TkC53wl,ikfmZW4/RvTZ8M6UK+5UzhK8jCdLuMGYL6KvzXGRSgi3yLgjewQtCPkIVz6D2QQz,CkcheAmCJ8MqyJu5zlzyZMjAvnnAT45tRAxekrsu94sQ4egdRCnbWSDtY7kh+BIm,lJNXoB1lBMEKIq4QDUOXoRgffuDghje1WrG9ML+Hbisq/yFOGwXD9RiX8F6sw6W4,avAuvDszue5L3sz85K+EC4Y/wFVDNvZo4TYXao6Z0f+lQKc0t8DQYzk1OXVu8rp2,yJMC6alLbBfODALZvYH7n7do1AZls4I9d1P4jnkDrQoxB3UqQ9hVl3LEKQ73xF1O,yK5GhDDX8oVfGKF5u+decIsH4YaTw7mP3GFxJSqv3+0lUFJoi5Lc5da149p90Ids,hCExroL1+7mryIkXPeFM5TgO9r0rvZaBFOvV2z0gp35Z0+L4WPlbuEjN/lxPFin+,HlUjr8gRsI3qfJOQFy/9rKIJR0Y/8Omwt/8oTWgy1mdeHmmjk7j1nYsvC9JSQ6Zv,MldlTTKB3zhThV1+XWYp6rjd5JW1zbVWEkLNxE7GJThEUG3szgBVGP7pSWTUTsqX,nLRbwHOoq7hHwg==,-----END CERTIFICATE-----,-----BEGIN CERTIFICATE-----,MIIFYDCCBEigAwIBAgIQQAF3ITfU6UK47naqPGQKtzANBgkqhkiG9w0BAQsFADA/,MSQwIgYDVQQKExtEaWdpdGFsIFNpZ25hdHVyZSBUcnVzdCBDby4xFzAVBgNVBAMT,DkRTVCBSb290IENBIFgzMB4XDTIxMDEyMDE5MTQwM1oXDTI0MDkzMDE4MTQwM1ow,TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh,cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwggIiMA0GCSqGSIb3DQEB,AQUAA4ICDwAwggIKAoICAQCt6CRz9BQ385ueK1coHIe+3LffOJCMbjzmV6B493XC,ov71am72AE8o295ohmxEk7axY/0UEmu/H9LqMZshftEzPLpI9d1537O4/xLxIZpL,wYqGcWlKZmZsj348cL+tKSIG8+TA5oCu4kuPt5l+lAOf00eXfJlII1PoOK5PCm+D,LtFJV4yAdLbaL9A4jXsDcCEbdfIwPPqPrt3aY6vrFk/CjhFLfs8L6P+1dy70sntK,4EwSJQxwjQMpoOFTJOwT2e4ZvxCzSow/iaNhUd6shweU9GNx7C7ib1uYgeGJXDR5,bHbvO5BieebbpJovJsXQEOEO3tkQjhb7t/eo98flAgeYjzYIlefiN5YNNnWe+w5y,sR2bvAP5SQXYgd0FtCrWQemsAXaVCg/Y39W9Eh81LygXbNKYwagJZHduRze6zqxZ,Xmidf3LWicUGQSk+WT7dJvUkyRGnWqNMQB9GoZm1pzpRboY7nn1ypxIFeFntPlF4,FQsDj43QLwWyPntKHEtzBRL8xurgUBN8Q5N0s8p0544fAQjQMNRbcTa0B7rBMDBc,SLeCO5imfWCKoqMpgsy6vYMEG6KDA0Gh1gXxG8K28Kh8hjtGqEgqiNx2mna/H2ql,PRmP6zjzZN7IKw0KKP/32+IVQtQi0Cdd4Xn+GOdwiK1O5tmLOsbdJ1Fu/7xk9TND,TwIDAQABo4IBRjCCAUIwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMCAQYw,SwYIKwYBBQUHAQEEPzA9MDsGCCsGAQUFBzAChi9odHRwOi8vYXBwcy5pZGVudHJ1,c3QuY29tL3Jvb3RzL2RzdHJvb3RjYXgzLnA3YzAfBgNVHSMEGDAWgBTEp7Gkeyxx,+tvhS5B1/8QVYIWJEDBUBgNVHSAETTBLMAgGBmeBDAECATA/BgsrBgEEAYLfEwEB,ATAwMC4GCCsGAQUFBwIBFiJodHRwOi8vY3BzLnJvb3QteDEubGV0c2VuY3J5cHQu,b3JnMDwGA1UdHwQ1MDMwMaAvoC2GK2h0dHA6Ly9jcmwuaWRlbnRydXN0LmNvbS9E,U1RST09UQ0FYM0NSTC5jcmwwHQYDVR0OBBYEFHm0WeZ7tuXkAXOACIjIGlj26Ztu,MA0GCSqGSIb3DQEBCwUAA4IBAQAKcwBslm7/DlLQrt2M51oGrS+o44+/yQoDFVDC,5WxCu2+b9LRPwkSICHXM6webFGJueN7sJ7o5XPWioW5WlHAQU7G75K/QosMrAdSW,9MUgNTP52GE24HGNtLi1qoJFlcDyqSMo59ahy2cI2qBDLKobkx/J3vWraV0T9VuG,WCLKTVXkcGdtwlfFRjlBz4pYg1htmf5X6DYO8A4jqv2Il9DjXA6USbW1FzXSLr9O,he8Y4IWS6wY7bCkjCWDcRQJMEhg76fsO3txE+FiYruq9RUWhiF1myv4Q6W+CyBFC,Dfvp7OOGAN6dEOM4+qR9sdjoSYKEBpsr6GtPAQw4dy753ec5,-----END CERTIFICATE-----",
            privatekey="-----BEGIN PRIVATE KEY-----,MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgAso4ZHa/K59RhLfv,HaorrKdXgXFk6BAj4ZhUzKIH3NqhRANCAAQbW3aW6PcMEoBhjJGMSsqK2i52XJJ/,8c1HjKEUH75ynzW6mRhMrBgwJV3JZxJAeSFgRAmCgykcV0sKQuMydBVg,-----END PRIVATE KEY-----"
        )

    def test_good_private_key_format(self):
        good_certificate = Certificate.objects.get(name="good_certificate")
        self.assertTrue(CertificateValidators.is_valid_private_key_format(good_certificate.privatekey))
        self.assertTrue(CertificateValidators.is_valid_private_key(good_certificate.privatekey))

    def test_bad_private_key_format(self):
        bad_certificate = Certificate.objects.get(name="bad_certificate")
        with self.assertRaisesMessage(ValidationError, f"The private key is not correct!"):
            CertificateValidators.is_valid_private_key_format(bad_certificate.privatekey)
        with self.assertRaisesMessage(ValidationError, "The private key is not correct!"):
            CertificateValidators.is_valid_private_key(bad_certificate.privatekey)

    def test_good_certificate_format(self):
        good_certificate = Certificate.objects.get(name="good_certificate")
        self.assertTrue(CertificateValidators.is_valid_certificate_format(good_certificate.certificate))
        self.assertTrue(CertificateValidators.is_valid_certificate(good_certificate.certificate))

    def test_bad_certificate_format(self):
        bad_certificate = Certificate.objects.get(name="bad_certificate")

        with self.assertRaisesMessage(ValidationError, "The certificate is not correct!"):
            CertificateValidators.is_valid_certificate_format(bad_certificate.certificate)

        with self.assertRaisesMessage(ValidationError, "The certificate is not correct!"):
            CertificateValidators.is_valid_certificate(bad_certificate.certificate)

    def test_matched_certificate_matches_private_key(self):
        good_certificate = Certificate.objects.get(name="good_certificate")
        self.assertTrue(CertificateValidators.private_key_and_certificate_matches(
            good_certificate.privatekey,
            good_certificate.certificate
        ))

    def test_not_matched_certificate_matches_private_key(self):
        not_matched = Certificate.objects.get(name="not_matched")
        with self.assertRaisesMessage(ValidationError, "Certificate and private key does not match!"):
            CertificateValidators.private_key_and_certificate_matches(
                not_matched.privatekey,
                not_matched.certificate
            )

    def test_certificate_chain(self):
        chain = Certificate.objects.get(name="chain")
        self.assertTrue(CertificateValidators.is_valid_certificate_format(chain.certificate))
        self.assertTrue(CertificateValidators.is_valid_certificate(chain.certificate))
        self.assertTrue(CertificateValidators.private_key_and_certificate_matches(
            chain.privatekey,
            chain.certificate
        ))
