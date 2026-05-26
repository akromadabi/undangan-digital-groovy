$content = @"
<VirtualHost *:80> 
    DocumentRoot "C:/laragon/www/UNDANG~1/public"
    ServerName undangan-digital.test
    ServerAlias *.undangan-digital.test
    <Directory "C:/laragon/www/UNDANG~1/public">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
"@

Set-Content -Path "C:\laragon\etc\apache2\sites-enabled\auto.undangan-digital.test.conf" -Value $content -Encoding ASCII
Write-Host "VHost config updated with short path!"
