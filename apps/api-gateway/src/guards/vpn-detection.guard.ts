import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import axios from 'axios';
import { Request } from 'express';

@Injectable()
export class VpnDetectionGuard implements CanActivate {
  private readonly IPHUB_API_KEY = process.env.IPHUB_API_KEY;
  private readonly BLOCK_VPN = process.env.BLOCK_VPN === 'true';
  public static IPHubRESPONSES = {
    RESIDENTIAL: 0, // Residential IP
    NON_RESIDENTIAL: 1, // Non-residential IP (business)
    PROXY_VPN: 2, // Proxy or VPN
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.BLOCK_VPN) return true; // Feature flag

    const request = context.switchToHttp().getRequest<Request>();
    const clientIp = this.extractClientIp(request);
    console.log('Client IP:', clientIp);

    if (!clientIp) {
      throw new ForbiddenException('Unable to determine your IP address');
    }

    if (await this.isVpnOrProxy(clientIp)) {
      throw new ForbiddenException('VPN/Proxy usage is not allowed');
    }

    return true;
  }

  private extractClientIp(request: Request): string | null | undefined {
    const forwardedFor = request.headers['x-forwarded-for'];
    console.log('Forwarded For:', forwardedFor);
    if (forwardedFor) {
      return Array.isArray(forwardedFor)
        ? forwardedFor[0].split(',')[0].trim()
        : forwardedFor.split(',')[0].trim();
    }

    return request.ip;
  }

  private async isVpnOrProxy(ip: string): Promise<boolean> {
    try {
      const response = await axios.get(`http://v2.api.iphub.info/ip/${ip}`, {
        headers: { 'X-Key': this.IPHUB_API_KEY }
      });

      return response.data.block === VpnDetectionGuard.IPHubRESPONSES.PROXY_VPN;

    } catch (error) {
      console.error('VPN detection failed:', error);
      return false;
    }
  }
}