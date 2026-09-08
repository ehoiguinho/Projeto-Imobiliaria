export default class Pagamento {

    constructor() {

        this.id = 0;
        this.aluguelId = 0;
        this.gateway = "ABACATEPAY";
        this.externalId = "";
        this.productId = null;
        this.checkoutId = null;
        this.status = "PENDENTE";
        this.url = null;
        this.criadoEm = null;
        this.pagoEm = null;

    }

    static toMap(row) {

        const pagamento = new Pagamento();

        pagamento.id = row.id;
        pagamento.aluguelId = row.aluguelId;
        pagamento.gateway = row.gateway;
        pagamento.externalId = row.externalId;
        pagamento.productId = row.productId;
        pagamento.checkoutId = row.checkoutId;
        pagamento.status = row.status;
        pagamento.url = row.url;
        pagamento.criadoEm = row.criadoEm;
        pagamento.pagoEm = row.pagoEm;

        return pagamento;
    }
}
