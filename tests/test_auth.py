"""Tests for Authentication endpoints."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_user_success(client: AsyncClient):
    payload = {
        "email": "devops.lead@example.com",
        "full_name": "DevOps Architect",
        "password": "StrongPassword123!",
        "role": "engineer",
        "team_id": "platform-infra"
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "devops.lead@example.com"
    assert data["full_name"] == "DevOps Architect"
    assert data["role"] == "engineer"
    assert "id" in data


@pytest.mark.asyncio
async def test_register_duplicate_email_fails(client: AsyncClient):
    payload = {
        "email": "duplicate@example.com",
        "full_name": "User One",
        "password": "Password123!",
        "role": "engineer",
        "team_id": "team-a"
    }
    res1 = await client.post("/api/v1/auth/register", json=payload)
    assert res1.status_code == 201

    res2 = await client.post("/api/v1/auth/register", json=payload)
    assert res2.status_code == 409
    assert res2.json()["error_code"] == "CONFLICT_ERROR"


@pytest.mark.asyncio
async def test_login_success_and_me(client: AsyncClient):
    # 1. Register
    reg_payload = {
        "email": "auth.test@example.com",
        "full_name": "Auth Tester",
        "password": "Password123!",
        "role": "engineer",
        "team_id": "core-sre"
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    # 2. Login
    login_payload = {
        "email": "auth.test@example.com",
        "password": "Password123!"
    }
    login_res = await client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

    # 3. Access /me with Bearer token
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}
    me_res = await client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "auth.test@example.com"


@pytest.mark.asyncio
async def test_login_invalid_password_fails(client: AsyncClient):
    payload = {
        "email": "wrong.pwd@example.com",
        "full_name": "User",
        "password": "CorrectPassword123!",
        "role": "engineer",
        "team_id": "core"
    }
    await client.post("/api/v1/auth/register", json=payload)

    login_res = await client.post("/api/v1/auth/login", json={
        "email": "wrong.pwd@example.com",
        "password": "IncorrectPassword"
    })
    assert login_res.status_code == 401
    assert login_res.json()["error_code"] == "AUTHENTICATION_ERROR"

