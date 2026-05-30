$files = Get-ChildItem 'c:\Users\Sarika\Downloads\codmint-internship-platform\*.html'
foreach ($f in $files) {
    $c = Get-Content $f.FullName -Raw -Encoding UTF8
    $c = $c -replace "href='/'", "href='index.html'"
    $c = $c -replace 'href="/"', 'href="index.html"'
    $c = $c -replace "href='/about'", "href='about.html'"
    $c = $c -replace 'href="/about"', 'href="about.html"'
    $c = $c -replace "href='/internships'", "href='internships.html'"
    $c = $c -replace 'href="/internships"', 'href="internships.html"'
    $c = $c -replace "href='/services'", "href='services.html'"
    $c = $c -replace 'href="/services"', 'href="services.html"'
    $c = $c -replace "href='/careers'", "href='careers.html'"
    $c = $c -replace 'href="/careers"', 'href="careers.html"'
    $c = $c -replace "href='/contact'", "href='contact.html'"
    $c = $c -replace 'href="/contact"', 'href="contact.html"'
    $c = $c -replace "href='/admin'", "href='admin.html'"
    $c = $c -replace 'href="/admin"', 'href="admin.html"'
    $c = $c -replace "href='/verify'", "href='verify.html'"
    $c = $c -replace 'href="/verify"', 'href="verify.html"'
    $c = $c -replace "href='/dashboard'", "href='dashboard.html'"
    $c = $c -replace 'href="/dashboard"', 'href="dashboard.html"'
    $c = $c -replace "href='/#verify'", "href='verify.html'"
    $c = $c -replace 'href="/#verify"', 'href="verify.html"'
    [System.IO.File]::WriteAllText($f.FullName, $c, [System.Text.Encoding]::UTF8)
    Write-Host "Fixed: $($f.Name)"
}
Write-Host "All done!"
