function Container1() {
  return (
    <div className="mb-[-16px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[15.6px] relative shrink-0 text-[#c9a24b] text-[10.4px] text-center tracking-[3.12px] uppercase whitespace-nowrap">Nossa Essência</p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute grid grid-cols-[repeat(1,minmax(0,1fr))] grid-rows-[repeat(1,fit-content(100%))] h-[46px] left-0 max-w-[672px] top-[16px] w-[672px]" data-name="Heading 2">
      <p className="[word-break:break-word] font-['Playfair_Display:Medium',sans-serif] font-medium justify-self-start leading-[45.77px] relative self-stretch shrink-0 text-[#1a1512] text-[39.8px] text-center w-[960px]">Uma galeria olfativa construída com rigor e paixão</p>
    </div>
  );
}

function Heading2Margin() {
  return (
    <div className="h-[108px] relative shrink-0 w-full" data-name="Heading 2:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[16px] relative size-full">
        <Heading />
      </div>
    </div>
  );
}

function ParagraphMargin() {
  return (
    <div className="absolute h-[58px] left-[28px] top-[92px] w-[919px]" data-name="Paragraph:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[28.8px] left-0 not-italic text-[#a8946f] text-[16px] text-justify top-0 w-[919px]">Apenas 5% das fragrâncias que avaliamos entram para a nossa coleção. Cada garrafa carrega uma história — e nós somos os seus curadores.</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Heading2Margin />
      <ParagraphMargin />
    </div>
  );
}

export default function Document() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[16px] relative size-full" data-name="Document">
      <Container />
    </div>
  );
}