$Username = 'shiptech\Administrator'
$Password = '!QAZ2wsxc'
$pass = ConvertTo-SecureString -AsPlainText $Password -Force
$credbuild = New-Object System.Management.Automation.PSCredential -ArgumentList $Username,$pass
Invoke-Command -ComputerName 10.1.1.6 -Credential $credbuild -ScriptBlock {
    Set-Location -Path c:\automated` deployment -PassThru;
    c:\automated` deployment\sqlDeploy10.6.ps1 4;
}
