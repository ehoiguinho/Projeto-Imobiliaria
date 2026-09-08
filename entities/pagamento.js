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
        pagamento.aluguelId = row.aluguelid;
        pagamento.gateway = row.gateway;
        pagamento.externalId = row.externalid;
        pagamento.productId = row.productid;
        pagamento.checkoutId = row.checkoutid;
        pagamento.status = row.status;
        pagamento.url = row.url;
        pagamento.criadoEm = row.criadoem;
        pagamento.pagoEm = row.pagoem;

        return pagamento;
    }
}