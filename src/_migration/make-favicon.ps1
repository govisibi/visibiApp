# Render the approved header logo mark at WordPress Site Icon size.
Add-Type -AssemblyName System.Drawing
$target = Join-Path $PSScriptRoot '..\wp-content\themes\visibi\assets\favicon.png'
$bitmap = New-Object System.Drawing.Bitmap 512,512
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.Clear([System.Drawing.Color]::FromArgb(7,14,34))
$white = New-Object System.Drawing.Pen ([System.Drawing.Color]::White),68
$white.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$white.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$graphics.DrawEllipse($white,88,88,264,264)
$graphics.DrawLine($white,323,379,430,272)
$blue = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(111,152,255))
$graphics.FillEllipse($blue,202,202,36,36)
$bitmap.Save($target,[System.Drawing.Imaging.ImageFormat]::Png)
$blue.Dispose(); $white.Dispose(); $graphics.Dispose(); $bitmap.Dispose()
Write-Output $target
