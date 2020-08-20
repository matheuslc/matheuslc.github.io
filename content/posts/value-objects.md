---
title: "Value Objects, Primitive Possesion & Types"
date: 2020-08-19T14:41:14-03:00
draft: false
---

Salve galera, tudo certo?

A ideia deste post é trazer a minha visão sobre como usar **Values Objects**, evitar **Primitive Possesions** e usar os **Types** do Golang para melhorar o design do seu projeto, evidenciando melhor o quê ele faz e com isso tornando o código legível e preparado para mudanças.

Lembrando que essa é a minha visão baseado em quem eu sou e minhas experiências. Leia sente criticando o que está sendo dito e não esqueça de comentar!


# Value Objects?
Esse conceito foi introduzido por Eric Evans no famoso livro (Domain Driven Design)[https://www.amazon.com.br/Domain-Driven-Design-Eric-Evans/dp/8550800651] e tive a oportunidade de aprender melhor no livro (Domain Modelling Made Functional)[https://www.amazon.com.br/Domain-Modeling-Made-Functional-Domain-Driven-ebook/dp/B07B44BPFB/ref=sr_1_1?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=Domain+Modelling+Made+Functional&qid=1597874431&s=books&sr=1-1] do Scott Wlaschin, que já recomendo aqui.

Basicamente, Values Objects são uma meneira de ter um objeto que representa um valor em sua aplicação. Um valor qualquer que não precise ser identificado por um ID, por exemplo. Isso quer dizer que um Value Object **não possuí identidade** e são **imutáveis**, não podem mudar seus valores após serem criados. Se o valor precisa mudar, então é gerado uma nova versão do Value Object.

**Mas por que imutável?**
Garantindo que seu Value Object é imutável, você impede que bugs de (compartilhamento de memória)[https://martinfowler.com/bliki/AliasingBug.html] ocorram. Em Golang, passando por valor ao invés do ponteiro já resolve isso, pois estaremos passando uma cópia que pode ser modificada sem refletir no valor original.

Se você precisa que sua estrutura tenha uma identidade, como um ID único, pra conseguir referenciar explicitamente, esse seu valor é uma *Entidade*.

### Como eu comparo dois Value Objects para ver se são os mesmo? (structural equality)

Em Golang, podemos comparar os tipos com **==**, tanto um *type* quanto uma *struct*. Se for do mesmo tipo e possuirem os mesmos campos com os mesmos valores, é igual, independente da referência de memória.

No Java (salve Javão), você precisaria sobrescrever o método **Equals** que verifica se dois objetos são iguais, verificando suas propriedades e não sua referência.

Então, se dois Value Objects são do mesmo tipo e possuem os mesmos valores, eles são iguais. São quase irmãos gêmeos mas cada um segue sua vida do seu jeito.

## Como assim?
Simplificando ao máximo, ao invés de você usar um tipo primitivo (int, float, etc) para representar um valor, você abstraí esse tipo primitivo em um "objeto", adicionando um nome e um significado. Por definição e também para gente não sair criando tipo para tudo, o valor precisa ter comportamento.

Um clássico exemplo de Value Object é o dinheiro. Que poderia ser represetando por um simples tipo. Abaixo veremos um exemplo com Dinheiro e vou adicionar o exemplo com o campo Name que ai é a mais a minha visão e não outras implementações.

```go

type Product struct {
  Name  string
  Price float64
}

product := Product{Name: "Salada Single", Price: 4.99}

// Output: The product Salada Single price is: 4.99
fmt.Printf("The product %v price is: %v", product.Name, product.Price)
```

Perfeitamente tranquilo, funcional e bonito. Mas, quando você estava fazendo a análise dessa projeto, você se referia ao preço do produto como um *float64*? O nome do produto como uma *string*? As pessoas de negócio precisam saber que o preço é um *float* e o *nome* uma string? Ele dizia isso durante as reuniões?

O ponto é, o tipo primitivo não reflete o seu negócio, reflete a implementação.

### Evoluindo mais no exemplo para que você, caro leitor, não vá embora

O DDD tem a intenção de tornar o design do seu código fácil de entender a ponto de uma pessoa de negócios conseguir ler seus domínios e entender o que cada coisa é e faz. Isso é chamado de *linguagem ubíqua* (ubiquitous language)[https://www.quora.com/What-is-Ubiquitous-language], uma linguagem única que todas as partes envolvidas no projeto conhecem e sabem o que é.

No nosso exemplo, quem lê o código sabe que existe uma estrutura *Product* com um campo Name string e um Price float64.

### A pergunta que eu te faço é, quais regras estão escondidas nesse design?

Provavelmente, nas reuniões de análise era falado sobre *nome do produto* e o *preço* do produto. O nome, possui regras de validação, como não pode ser em branco e tem um limite de 80 caracteres. O preço, precisa ser maior que 0, e quando falamos do preço, estamos falando de *dinheiro*, *moeda*, *cash*, *money*, não um valor qualquer. O *dinheiro* muda sua representação de país para país, pode ser convertido, como dólar para real,

No design atual, todas essas regras seriam funções que recebem uma estrutura *Product* e faz as operações de validações lendo os atributos da estrutura. Ou podemos criar uma função construtora  e encapsular essas regras dentro deste objeto.

```go

// Agora product é privado para ser possível criar apenas usando a funcão NewProduct
type product struct {
  Name  string
  Price float64
}

func NewProduct(name string, price float64) (product, error) {
	product := product{}
	nameSize := len(name)

	if nameSize <= 0 {
		return product, errors.New("Product name cannot be empty")
	}

	if nameSize > 80 {
		return product, errors.New("Product name max length is 80")
	}

	if price <= 0 {
		return product, errors.New("Product price must greater than 0")
	}

	product.Name = name
	product.Price = price

	return product, nil
}

// Criando um produto inválido
product, err := NewProduct("", 4.99)

if err != nil {
  // Output: Like we say in Brazil, deu ruim, o motivo? Product name cannot be empty
  fmt.Printf("Like we say in Brazil, deu ruim, o motivo? %v", err.Error())
}

product, err := NewProduct("Salada Single", 0)

if err != nil {
  // Output: Like we say in Brazil, deu ruim, o motivo? Product price must greater than 0
  fmt.Printf("Like we say in Brazil, deu ruim, o motivo? %v", err.Error())
}

// Criando um produto válido
product, err := NewProduct("", 4.99)

// Output: The product Salada Single price is: 4.99
fmt.Printf("The product %v price is: %v", product.Name, product.Price)
```

Show, agora temos a validações. Mas qual é o problema?

Primeiro, você deve ter percebido que o construtor ficou grande e cheio de (guard-clauses)[https://refactoring.guru/replace-nested-conditional-with-guard-clauses], podemos extrair as validações para funções separadas que validam esses atributos. E ai você deve estar pensando.

- Bom, essa validação de valores posso usar em outros pontos do código. Vou extrair para um pacote separado.

E ai nasce mais um pacote *utils*.

### E qual o problema de ter um pacote utils?

Um pacote utils não diz muito bem o que ele faz sem que o usuário vá lá e verifique todas as funções públicas que ele expõe.

Por exemplo, poderíamos ter um pacote que sabe validar strings com regras definidas. Mas as chances de um novo desenvolvedor simplismente recriar a validação ao invés de procurar pelo pacote utils é grande. Reaproveitamos as regras de validação mas as checegens sempre vão precisar existir quando uma nova estrutura com o mesmo conceito existir.

```go

type deliveryOrder struct {
  Products []Product
  Price    float64
}

func NewDeliveryOrder(price float64, products []Product) (DeliveryOrder, error) {
  order := deliveryOrder{}
  // extraimos nossas funções em um pacote auxiliar
  if priceutils.PriceMustBeGraterThan(0, price) {
    return order, errors.New("Price must be bigger than 0")
  }

  // Outras validações seguem o mesmo exemplo

  order.Procuts = prdocuts
  order.Price = price

  return order, nil
}

```

Não estou dizendo que não devem existir pacotes de validação, como o (ozzo-validation)[https://github.com/go-ozzo/ozzo-validation]. O propósito do negócio da biblioteca ozzo-validation é validar valores, o nosso é criar um produto válido e podemos usar um pacote de validação para nos ajudar a chegar nesse objetivo.


### Como pode ser feito? Chegou a punch-line (ou o drop da música)

E se ao invés de representar como um valor primitivo a gente criar um tipo para esses valores?

```go

type smallName string
type amount float64
type currency string

type money struct {
  amount
  currency
}

type product struct {
  name smallName
  price money
}

func NewSmallName(name string) (smallName, error) {
  nameSize := len(name)

  if nameSize > 0 && < 80 {
    return smallName(name), nil
  }

  return smallName, errors.New("Small name size need to be greather than 0 and lower than 80")
}

const (
  BRL = "BRL"
  USD = "USD"
)

func NewMoney(a amount, cur currency) (money, error) {
  if a > 0 {
    return money{amount: a, currency: cur}, nil
  }

  return 0, errors.New("Money amount need to be greater than 0")
}

name, error := NewSmallName("Salada Single")
price, error := NewMoney(4.99, BRL)

// handle error gracefully here

// Nosso produto não precisa mais saber o que é um nome ou um dinheiro válido.
// A própria struct já diz que precisa ser um tipo válido
product := product{name: name, price: price}
```

Criamos tipos novos com suas responsabilidades isoladas. Esses tipos agora podem ser reaproveitados em outros pontos do código. Você não precisa escrever um teste unitário para checar que o produto possuí valores válidos, a própria análise estática, com o tipo assinado garante isso pra você. Ao invés disso, você garante a validação escrevendo um teste unitário para o tipo e todos que usam ele esperam que já seja um tipo válido.

Outro ganho, é que quem lê a estrutura **product** sabe bem o quê ele possuí, ao invés de um **float64**, ele possuí um tipo **Currency**, que é bem mais que um valor simples. Você pode agora adicionar diversas funções para o tipo ao invés de um pacote *utils* que possuí executa ações em um tipo primitivo. Suas funções podem deixar explícito na assinatura o quê espera e garante que é um tipo válido.

Ganhamos coesão, com responsabilidades abstraídas e reuso de código.

### Primitive Obsession

É um Code Smell que aparece quando usamos tipos primitivos para representar valores simples. O problema que isso traz é exatamente o que vimos no exemplo acima. código duplicado, valores sem significado, aumento no número de *ifs* para controle de fluxos e o compilador só vai garantir que é uma string e mais nada (compiler says: am I a joke for you????).

Ao invés de tipos primitivos, o esquema é pensar em tipos reais, que explicam sua aplicação e cria uma linguagem única para todos. Esses tipos também melhoram a documentação do código, que pode impedir alguma nova ideia de criar documentação fora do código.

#### Referências



### Tipos? Mas o nome é Value Object mano. Enfim a hipocrisia

Value Objects nasceu para o paradigma orientado a objetos, para simular eles nessas linguagens você precisa criar classes na maioria dos casos. Em linguagens dinamicamente tipadas, em que o tipo não importa, você perde um pouco de "documentação" e legibilidade, já que não pode descrever os tipos aceitos.

Em golang, podemos descrever tipos estaticamente e criar tipos customizados para abstrair valores primitivos. Isso é muito poderoso e estimula a galera a modelar com tipos ao invés de modelar pensando em classes.

## Conclusão

Usando melhor os sitemas de tipos, podemos melhorar nossa legibilidade do sistema, deixar conceitos explícitos e permitir que o código seja uma documentação do negócio. Usando melhor o sistema de tipos e o conceito de **Value Objects**, podemos evitar **Primitive Obsession** e usar o compilador para testar nossas regras de negócio.

## Tem alguma visão diferente? Curtiu? Deixa um salve nos comentários

Esse post é fruto dos meus estudos e experiências. Se você tem alguma maneira diferente de exergar ou acha que pode agregar, deixar nos comentários. Qualquer crítica construtiva é super bem-vinda e irá refletir nas ideias desse post também.

vaaaaaleu