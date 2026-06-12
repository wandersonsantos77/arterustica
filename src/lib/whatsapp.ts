const WHATSAPP_NUMBER = '5521981099926';

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function productInquiryMessage(productName: string): string {
  return `Ola! Tenho interesse no produto: *${productName}*. Gostaria de mais informacoes sobre preco e disponibilidade.`;
}

export function generalInquiryMessage(): string {
  return `Ola! Vim pelo site Arte Rustica e gostaria de conhecer mais sobre os artesanatos em cimento.`;
}

export function quoteRequestMessage(name: string, environment: string, details: string): string {
  return `Ola! Meu nome e *${name}*. Gostaria de um orcamento para decoracao de *${environment}*.\n\nDetalhes: ${details}`;
}

export function professionalInquiryMessage(name: string, role: string): string {
  return `Ola! Meu nome e *${name}*, sou *${role}* e gostaria de conversar sobre parceria e fornecimento de pecas para meus projetos.`;
}
