import React from "react";
import EclipseButton from "../../../components/Button/EclipseButton";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import { useUser } from "../../../context/userContext";
import {
  TimeAgoHourFormat,
  TimeAgoHourFormatSimple,
} from "../../../helpers/moment";
import {
  upercasePrimaryLetter,
  UppercasePrimaryLetter,
} from "../../../helpers/Other";
import TicketPaymount from "./Ticket";

export default function ViewPayment({ data, setClose }) {
  const { userData } = useUser();
  const close = () => {
    setClose();
  };
  return (
    <div>
      {/* header */}
      <div className="flex flex-col pb-2">
        <div className="flex items-center">
          <h1 className="mr-auto leading-8 text-2xl font-bold tracking-tight dark:text-neutral-200">
            Registro de pagos
          </h1>
          <div>
            <EclipseButton
              onClick={close}
              type="default"
              size="medium"
              icon={
                <svg
                  className=" dark:text-zinc-300"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4.70711 3.29289C4.31658 2.90237 3.68342 2.90237 3.29289 3.29289C2.90237 3.68342 2.90237 4.31658 3.29289 4.70711L10.5858 12L3.29289 19.2929C2.90237 19.6834 2.90237 20.3166 3.29289 20.7071C3.68342 21.0976 4.31658 21.0976 4.70711 20.7071L12 13.4142L19.2929 20.7071C19.6834 21.0976 20.3166 21.0976 20.7071 20.7071C21.0976 20.3166 21.0976 19.6834 20.7071 19.2929L13.4142 12L20.7071 4.70711C21.0976 4.31658 21.0976 3.68342 20.7071 3.29289C20.3166 2.90237 19.6834 2.90237 19.2929 3.29289L12 10.5858L4.70711 3.29289Z"
                    fill="currentColor"
                    style={{
                      strokeWidth: "0",
                    }}
                  ></path>
                </svg>
              }
            />
          </div>
        </div>
        <span className="leading-4 flex mt-1 text-xs dark:text-neutral-400">
          Los datos como el usuario, la fecha, y algunas informaciones del
          navegador utilizado seran guardados por seguridad.
        </span>
      </div>
      {/* body */}
      <div className="flex flex-col gap-2">
        <div className="p-1 flex flex-col gap-2 border-b pb-4">
          <div className="flex items-center text-sm gap-1">
            <div className="text-neutral-600 min-w-[100px]">Boleta</div>
            <div className="mx-2">:</div>
            <div className="font-semibold">{data.billHeader}</div>
          </div>
          <div className="flex items-center text-sm gap-1">
            <div className="text-neutral-600 min-w-[100px]">Socio</div>
            <div className="mx-2">:</div>
            <div className="font-semibold">
              {upercasePrimaryLetter(data.member.names)}
            </div>
          </div>
          <div className="flex items-center text-sm gap-1">
            <div className="text-neutral-600 min-w-[100px]">N° Documento</div>
            <div className="mx-2">:</div>
            <div className="font-semibold">
              {upercasePrimaryLetter(data.member.dni)}
            </div>
          </div>
          <div className="flex items-center text-sm gap-1">
            <div className="text-neutral-600 min-w-[100px]">Fecha</div>
            <div className="mx-2">:</div>
            <div className="font-semibold flex items-center gap-2">
              <div>
                {UppercasePrimaryLetter(
                  TimeAgoHourFormatSimple(data.payment_at)
                )}
              </div>
              <div>-</div>
              <div className="text-xs text-neutral-500">
                {UppercasePrimaryLetter(TimeAgoHourFormat(data.payment_at))}
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm gap-1">
            <div className="text-neutral-600 min-w-[100px]">Concepto</div>
            <div className="mx-2">:</div>
            <div className="font-semibold flex items-center gap-2">
              <div className="text-xs text-neutral-500">
                {data.concept.name}
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm gap-1">
            <div className="text-neutral-600 min-w-[100px]">Metodo</div>
            <div className="mx-2">:</div>
            <div className="font-semibold flex items-center">
              {data.paymentType === "cash" && "Efectivo"}{" "}
              {data.paymentType === "electronicBankTransfers" &&
                "Transferencia"}
              {data.paymentType === "mobilePayments" && "Pago via Mobil"}
              {data.paymentType === "electronicBankTransfers" && (
                <div className="text-neutral-600 text-sm">
                  {" - "}
                  {data.codePaymentType}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center text-sm gap-1">
            <div className="text-neutral-600 min-w-[100px]">Responsable</div>
            <div className="mx-2">:</div>
            <div className="flex items-center gap-2">
              <div className="w-[25px] min-w-[25px] h-[25px] overflow-hidden border rounded-full">
                <img
                  className="object-cover w-full h-full"
                  src={data.userCreated.photo}
                  referrerPolicy="no-referrer"
                  alt=""
                />
              </div>
              <div className="font-semibold text-xs">
                {data.userCreated.names}
                {data.userCreated.uid === userData.uid && " (Yo)"}
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm gap-1">
            <div className="text-neutral-600 min-w-[100px]">Importe Total</div>
            <div className="mx-2">:</div>
            <div className="dark:text-amber-100 text-neutral-700 font-semibold flex items-center gap-1">
              <div className="ml-2 min-w-max">
                S/ {data.totalImported.toFixed(2)}
              </div>
              <div className="w-4 h-4">
                <svg viewBox="0 0 24 24" fill="none" className="icon-stroke">
                  <g id="SVGRepo_iconCarrier">
                    <path d="M11.74 17.7499H17.66C17.57 17.8299 17.48 17.8999 17.39 17.9799L13.12 21.1799C11.71 22.2299 9.41001 22.2299 7.99001 21.1799L3.71001 17.9799C2.77001 17.2799 2 15.7299 2 14.5599V7.14986C2 5.92986 2.93001 4.57986 4.07001 4.14986L9.05 2.27986C9.87 1.96986 11.23 1.96986 12.05 2.27986L17.02 4.14986C17.97 4.50986 18.78 5.50986 19.03 6.52986H11.73C11.51 6.52986 11.31 6.53987 11.12 6.53987C9.27 6.64987 8.78999 7.31986 8.78999 9.42986V14.8598C8.79999 17.1598 9.39001 17.7499 11.74 17.7499Z"></path>{" "}
                    <path d="M8.80005 11.22H22"></path>
                    <path d="M22 9.41977V14.9698C21.98 17.1898 21.37 17.7397 19.06 17.7397H11.7401C9.39005 17.7397 8.80005 17.1498 8.80005 14.8398V9.40976C8.80005 7.30976 9.28005 6.63974 11.1301 6.51974C11.3201 6.51974 11.5201 6.50977 11.7401 6.50977H19.06C21.41 6.51977 22 7.09977 22 9.41977Z"></path>{" "}
                    <path d="M11.3201 15.2598H12.6501"></path>
                    <path d="M14.75 15.2598H18.02"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm gap-1">
            <div className="text-neutral-600 min-w-[100px]">Observaciones</div>
            <div className="mx-2">:</div>
            <div>
              {data.observations.slice(0, 85)}
              {data.observations.length > 85 && "..."}
            </div>
          </div>
        </div>
        <div className="text-sm gap-1">
          <div className="text-neutral-600 min-w-[100px] mb-2">
            Lista de pagos:
          </div>
          <div className=" flex flex-col gap-1 p-2 border rounded-lg">
            <table>
              <thead>
                <tr>
                  <th className="font-semibold text-sm text-left">Boleta</th>
                  <th className="font-semibold text-sm text-left">Fecha</th>
                  <th className="font-semibold text-sm text-right">Importe</th>
                  <th className="font-semibold text-sm text-right">Deuda</th>
                  <th className="font-semibold text-sm text-left pl-2">
                    Notas
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.paymountList.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2">{item.billNumber}</td>
                    <td className="py-2">{item.date}</td>
                    <td className="py-2 text-right font-semibold">
                      S/ {parseInt(item.imported).toFixed(2)}
                    </td>
                    <td className="py-2 text-right font-semibold">
                      S/ {parseInt(item.debt).toFixed(2)}
                    </td>
                    <td className="py-2 pl-2">{item.observations}</td>
                  </tr>
                ))}
                <tr>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-sm gap-1">
          <div className="text-neutral-600 min-w-[100px] mb-2">
            Metadatos del usuario:
          </div>
          <div className="flex flex-col gap-1 p-4 border rounded-lg">
            <div className="flex  gap-2">
              <div className="min-w-[140px] text-sm text-neutral-600">
                Nombre App:
              </div>
              <div className="font-semibold">{data.metadata.appName}</div>
            </div>
            <div className="flex gap-2">
              <div className="min-w-[140px] text-sm text-neutral-600">Ip:</div>
              <div className="font-semibold">{data.metadata.ip}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="min-w-[140px] text-sm text-neutral-600">
                Plataforma:
              </div>
              <div className="font-semibold">{data.metadata.platform}</div>
            </div>

            <div className="flex gap-2">
              <div className="min-w-[140px] text-sm text-neutral-600">
                Vendor:
              </div>
              <div className="font-semibold">{data.metadata.vendor}</div>
            </div>
          </div>
        </div>
      </div>
      {/* footer */}
      <div className="mt-2">
        <TicketPaymount
          Component={
            <PrimaryButton type="default">
              <div className="flex items-center gap-2">
                <span className="w-4">
                  <svg viewBox="0 0 24 24" fill="none" className="icon-stroke">
                    <g id="SVGRepo_iconCarrier">
                      <path d="M7.25 7H16.75V5C16.75 3 16 2 13.75 2H10.25C8 2 7.25 3 7.25 5V7Z"></path>{" "}
                      <path d="M16 15V19C16 21 15 22 13 22H11C9 22 8 21 8 19V15H16Z"></path>{" "}
                      <path d="M21 10V15C21 17 20 18 18 18H16V15H8V18H6C4 18 3 17 3 15V10C3 8 4 7 6 7H18C20 7 21 8 21 10Z"></path>{" "}
                      <path d="M17 15H15.79H7"></path>{" "}
                      <path d="M7 11H10"></path>{" "}
                    </g>
                  </svg>
                </span>
                Imprimir boleta
              </div>
            </PrimaryButton>
          }
          Payment={data}
        />
      </div>
    </div>
  );
}
