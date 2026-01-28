# API Test Script (PowerShell)
# Usage: .\scripts\test-api.ps1

$BaseUrl = "http://localhost:3004"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Claude Skills Hub - API Test" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: User Registration
Write-Host "Test 1: User Registration" -ForegroundColor Yellow
$registerBody = @{
    email = "testuser@example.com"
    username = "testuser"
    password = "password123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $registerBody

    if ($registerResponse.message -eq "User registered successfully") {
        Write-Host "Success: User registered" -ForegroundColor Green
        $token = $registerResponse.data.token
        Write-Host "Token: $($token.Substring(0, 20))..."
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "User already exists, trying login..." -ForegroundColor Yellow
    } else {
        Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 2: User Login
Write-Host "Test 2: User Login" -ForegroundColor Yellow
$loginBody = @{
    email = "testuser@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody

    if ($loginResponse.message -eq "Login successful") {
        Write-Host "Success: Login successful" -ForegroundColor Green
        $token = $loginResponse.data.token
        Write-Host "User ID: $($loginResponse.data.userId)"
    }
} catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Get Skills List
Write-Host "Test 3: Get Skills List" -ForegroundColor Yellow
try {
    $skillsResponse = Invoke-RestMethod -Uri "$BaseUrl/api/skills" -Method Get

    if ($skillsResponse.message -eq "Skills retrieved successfully") {
        Write-Host "Success: Skills retrieved" -ForegroundColor Green
        Write-Host "Total: $($skillsResponse.data.total) skills"
        Write-Host "Current page: $($skillsResponse.data.page)"
    }
} catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Filtered Skills List
Write-Host "Test 4: Filtered Skills List" -ForegroundColor Yellow
try {
    $filteredResponse = Invoke-RestMethod -Uri "$BaseUrl/api/skills?sort=newest&limit=5" -Method Get

    if ($filteredResponse.message -eq "Skills retrieved successfully") {
        Write-Host "Success: Filtered skills retrieved" -ForegroundColor Green
        Write-Host "Results: $($filteredResponse.data.skills.Count) skills"
    }
} catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Error Handling - Invalid Login
Write-Host "Test 5: Error Handling - Invalid Login" -ForegroundColor Yellow
$invalidLoginBody = @{
    email = "invalid@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $errorResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $invalidLoginBody
    
    Write-Host "Failed: Should have returned error" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "Success: Error handling correct (401 Unauthorized)" -ForegroundColor Green
    } else {
        Write-Host "Warning: Wrong status code: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Tests Complete!" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
