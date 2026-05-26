$content = @"
<VirtualHost *:80> 
    DocumentRoot "C:/laragon/www/Undangan Digital/public"
    ServerName undangan-digital.test
    ServerAlias *.undangan-digital.test
    <Directory "C:/laragon/www/Undangan Digital/public">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
"@

Set-Content -Path "C:\laragon\etc\apache2\sites-enabled\auto.undangan-digital.test.conf" -Value $content -Encoding ASCII
Write-Host "VHost config created successfully!"
