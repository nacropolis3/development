import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { TimeAgoDateComplete } from "../../../helpers/moment";
import {
  upercasePrimaryLetter,
  UppercasePrimaryLetter,
} from "../../../helpers/Other";

export default function TicketPaymount({
  Payment,
  Component,
  FinallyFunction,
}) {
  const componentRef = useRef();
  const [loading, setLoading] = useState(false);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "F-9430949",
    onAfterPrint: endPrint,
  });

  function endPrint() {
    if (FinallyFunction) {
      FinallyFunction();
      return;
    }
    return setLoading(false);
  }

  const handleOpen = async () => {
    await setLoading(true);
    handlePrint();
  };
  useEffect(() => {
    if (!Component) {
      handleOpen();
    }
  }, [Component]);
  return (
    <div>
      {Component && <div onClick={handleOpen}>{Component}</div>}
      <div className="hidden">
        {loading && (
          <div
            ref={componentRef}
            className="bg-white font-mono p-5 rounded-lg max-w-[370px] border-r"
          >
            <div>
              {/* header */}
              <div className="flex flex-col border-b border-dashed border-b-neutral-300 mb-2 pb-2">
                <div className=" text-center">
                  <h1 className="mr-auto leading-8 text-xl font-bold tracking-tight dark:text-neutral-200">
                    **Boleta de pago**
                  </h1>
                </div>
                {/* <span className="leading-4 flex text-[10px] dark:text-neutral-400">
                  ** Solo valido con la Entidad Nueva Acropolis**
                </span> */}
                <div className=" text-[10px] text-center flex flex-col">
                  <span>Asociación Nueva Acrópolis</span>
                  <span>Jr. Libertad N° 569</span>
                  <span>RUC 20113015765</span>
                  <span>Celular 957070835</span>
                </div>
              </div>
              {/* body */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-0">
                  <div className="flex items-center text-[11px] gap-1">
                    <div className="text-neutral-800 min-w-[100px]">Boleta</div>
                    <div className="mx-1">:</div>
                    <div className="">{Payment.billHeader}</div>
                  </div>
                  <div className="flex text-[11px] gap-1">
                    <div className="text-neutral-800 min-w-[100px]">
                      Socio (a)
                    </div>
                    <div className="mx-1">:</div>
                    <div className="left-3 flex">
                      {upercasePrimaryLetter(Payment.member.names)}
                    </div>
                  </div>
                  <div className="flex items-center text-[11px] gap-1">
                    <div className="text-neutral-800 min-w-[100px]">
                      N° Documento
                    </div>
                    <div className="mx-1">:</div>
                    <div className="">
                      {upercasePrimaryLetter(Payment.member.dni)}
                    </div>
                  </div>
                  <div className="flex items-center text-[11px] gap-1">
                    <div className="text-neutral-800 min-w-[100px]">Fecha</div>
                    <div className="mx-1">:</div>
                    <div className=" flex items-center gap-2">
                      <div>
                        {UppercasePrimaryLetter(
                          TimeAgoDateComplete(Payment.payment_at)
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-[11px] gap-1">
                    <div className="text-neutral-800 min-w-[100px]">
                      Concepto
                    </div>
                    <div className="mx-1">:</div>
                    <div className="flex items-center gap-2">
                      <div className="">{Payment.concept.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-[11px] gap-1">
                    <div className="text-neutral-800 min-w-[100px]">Metodo</div>
                    <div className="mx-1">:</div>
                    <div className="flex items-center">
                      {Payment.paymentType === "cash" && "Efectivo"}{" "}
                      {Payment.paymentType === "electronicBankTransfers" &&
                        "Transferencia"}
                      {Payment.paymentType === "mobilePayments" &&
                        "Pago via Mobil"}
                      {Payment.paymentType === "electronicBankTransfers" && (
                         " N°: "+ Payment.codePaymentType
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-[11px] gap-1">
                    <div className="text-neutral-800 min-w-[100px]">
                      Meses pagados
                    </div>
                    <div className="mx-1">:</div>
                    <div className=" flex items-center gap-1">
                      <div className=" min-w-max">
                        {Payment.paymountList.length} Meses
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-[11px] gap-1">
                    <div className="text-neutral-800 min-w-[100px]">
                      Importe Total
                    </div>
                    <div className="mx-1">:</div>
                    <div className=" font-semibold flex items-center gap-1">
                      <div className=" min-w-max">
                        S/ {Payment.totalImported.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex text-[11px] gap-1">
                    <div className="text-neutral-800 min-w-[100px]">
                      Observaciones
                    </div>
                    <div className="mx-1">:</div>
                    <div className="text-[9px]">
                      {!Payment.observations && "Sin observaciones"}
                      {Payment.observations}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] gap-1">
                  <div className="text-neutral-800 min-w-[100px]">Items:</div>
                  <div className=" flex flex-col gap-1">
                    <table>
                      <thead>
                        <tr>
                          <th className="font-semibold min-w-[50px]  text-[11px] text-left">
                            Mes
                          </th>
                          <th className="font-semibold text-[11px] text-left pl-2">
                            Observaciones
                          </th>
                          <th className="font-semibold text-[11px] min-w-[80px] text-right">
                            Importe
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Payment.paymountList.map((item, index) => (
                          <tr
                            key={index}
                            className="text-[9px] border-t border-dashed border-t-neutral-700"
                          >
                            <td className="py-0">{item.date}</td>
                            <td className=" pl-2">
                              {item.observation}
                              {item.debt > 0 &&
                                "Deuda pendiente S/ " + parseFloat(item.debt).toFixed(2)}
                            </td>
                            <td className=" text-right font-semibold">
                              S/ {parseFloat(item.imported).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        <tr className="text-[9px] border-t border-dashed border-t-neutral-700">
                          <td>Total</td>
                          <td></td>
                          <td className="text-right font-semibold">
                            S/ {Payment.totalImported.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* footer */}
              <div className="text-[8px] text-right mt-5">
                {TimeAgoDateComplete()} - Ayacucho - Perú
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
