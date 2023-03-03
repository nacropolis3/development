import React from "react";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";

// Create Document Component
export const Boleta = (payment) => (
  <Document>
    <Page size="A4">
      <View
        style={{
          display: "flex",
          padding: "10px",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image
            source="public/acropolis_logo.png"
            style={{
              width: "100px",
            }}
          />
          <View
            style={{
              width: "100%",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: "18px",
                  marginTop: "5px",
                  fontWeight: "bold",
                }}
              >
                NUEVA ACROPOLIS
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  marginTop: "-5px",
                }}
              >
                Comprobante de pago
              </Text>
            </View>
          </View>
          <View>
            <Image
              style={{
                width: "40px",
                margin: "0 auto",
              }}
              src="public/metacorp.png"
            />
            <Text
              style={{
                fontSize: "12px",
              }}
            >
              Power by MetaCorp
            </Text>
          </View>
        </View>
        {/* <div
          style={{
            borderRadius: "5px",
            marginTop: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "4px",
              fontSize: "15px",
            }}
          >
            <h1>Boleta: </h1>
            <h1>META-09848</h1>
          </div>
          <div
            style={{
              display: "flex",
              gap: "4px",
              fontSize: "15px",
            }}
          >
            <h1>Socio: </h1>
            <h1>
              {upercasePrimaryLetter(
                concatString([
                  memberSelected.lastName,
                  memberSelected.motherLastName + ", ",
                  memberSelected.names,
                ])
              )}
            </h1>
          </div>
          <div
            style={{
              display: "flex",
              gap: "4px",
              fontSize: "15px",
            }}
          >
            <h1>Concepto: </h1>
            <h1>{upercasePrimaryLetter(concept.name)}</h1>
          </div>
          <div
            style={{
              display: "flex",
              gap: "4px",
              fontSize: "15px",
            }}
          >
            <h1>Fecha de pago: </h1>
            <h1>{moment().format("LL")}</h1>
          </div>
          <div
            style={{
              display: "flex",
              gap: "4px",
              fontSize: "15px",
            }}
          >
            <h1>Observaciones: </h1>
            <h1>{data.observations}</h1>
          </div>
        </div> */}

        {/* <div
          style={{
            marginTop: "10px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              marginTop: "50px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontWeight: "bold",
              }}
            >
              <h1
                style={{
                  width: "100px",
                }}
              >
                Boleta
              </h1>
              <h1
                style={{
                  width: "120px",
                }}
              >
                Concepto
              </h1>
              <h1
                style={{
                  width: "120px",
                }}
              >
                Mes
              </h1>
              <h1
                style={{
                  width: "100px",
                }}
              >
                Importe
              </h1>
            </div>

            <div
              style={{
                display: "flex",
                padding: "5px 0",
              }}
            >
              <h1
                style={{
                  width: "100px",
                }}
              >
                META-00039
              </h1>
              <h1
                style={{
                  width: "120px",
                }}
              >
                Cuota
              </h1>
              <h1
                style={{
                  width: "120px",
                }}
              >
                Marzo - 2023
              </h1>
              <h1
                style={{
                  width: "120px",
                }}
              >
                S/ 938
              </h1>
            </div>

            <div
              style={{
                display: "flex",
                padding: "5px 0",
              }}
            >
              <h1
                style={{
                  width: "100px",
                }}
              ></h1>
              <h1
                style={{
                  width: "100px",
                }}
              ></h1>
              <h1
                style={{
                  width: "100px",
                }}
              ></h1>
              <h1
                style={{
                  width: "100px",
                  fontWeight: "bold",
                }}
              >
                Total S/ 8738
              </h1>
            </div>
          </div>
        </div> */}
        {/* <PDFViewer width={500} height={600}>
                  <Boleta />
                </PDFViewer> */}
      </View>
    </Page>
    <Page size="A4">
      <View
        style={{
          display: "flex",
          padding: "10px",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image
            source="public/acropolis_logo.png"
            style={{
              width: "100px",
            }}
          />
          <View
            style={{
              width: "100%",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: "18px",
                  marginTop: "5px",
                  fontWeight: "bold",
                }}
              >
                NUEVA ACROPOLIS
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  marginTop: "-5px",
                }}
              >
                Comprobante de pago
              </Text>
            </View>
          </View>
          <View>
            <Image
              style={{
                width: "40px",
                margin: "0 auto",
              }}
              src="public/metacorp.png"
            />
            <Text
              style={{
                fontSize: "12px",
              }}
            >
              Power by MetaCorp
            </Text>
          </View>
        </View>
        {/* <div
          style={{
            borderRadius: "5px",
            marginTop: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "4px",
              fontSize: "15px",
            }}
          >
            <h1>Boleta: </h1>
            <h1>META-09848</h1>
          </div>
          <div
            style={{
              display: "flex",
              gap: "4px",
              fontSize: "15px",
            }}
          >
            <h1>Socio: </h1>
            <h1>
              {upercasePrimaryLetter(
                concatString([
                  memberSelected.lastName,
                  memberSelected.motherLastName + ", ",
                  memberSelected.names,
                ])
              )}
            </h1>
          </div>
          <div
            style={{
              display: "flex",
              gap: "4px",
              fontSize: "15px",
            }}
          >
            <h1>Concepto: </h1>
            <h1>{upercasePrimaryLetter(concept.name)}</h1>
          </div>
          <div
            style={{
              display: "flex",
              gap: "4px",
              fontSize: "15px",
            }}
          >
            <h1>Fecha de pago: </h1>
            <h1>{moment().format("LL")}</h1>
          </div>
          <div
            style={{
              display: "flex",
              gap: "4px",
              fontSize: "15px",
            }}
          >
            <h1>Observaciones: </h1>
            <h1>{data.observations}</h1>
          </div>
        </div> */}

        {/* <div
          style={{
            marginTop: "10px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              marginTop: "50px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontWeight: "bold",
              }}
            >
              <h1
                style={{
                  width: "100px",
                }}
              >
                Boleta
              </h1>
              <h1
                style={{
                  width: "120px",
                }}
              >
                Concepto
              </h1>
              <h1
                style={{
                  width: "120px",
                }}
              >
                Mes
              </h1>
              <h1
                style={{
                  width: "100px",
                }}
              >
                Importe
              </h1>
            </div>

            <div
              style={{
                display: "flex",
                padding: "5px 0",
              }}
            >
              <h1
                style={{
                  width: "100px",
                }}
              >
                META-00039
              </h1>
              <h1
                style={{
                  width: "120px",
                }}
              >
                Cuota
              </h1>
              <h1
                style={{
                  width: "120px",
                }}
              >
                Marzo - 2023
              </h1>
              <h1
                style={{
                  width: "120px",
                }}
              >
                S/ 938
              </h1>
            </div>

            <div
              style={{
                display: "flex",
                padding: "5px 0",
              }}
            >
              <h1
                style={{
                  width: "100px",
                }}
              ></h1>
              <h1
                style={{
                  width: "100px",
                }}
              ></h1>
              <h1
                style={{
                  width: "100px",
                }}
              ></h1>
              <h1
                style={{
                  width: "100px",
                  fontWeight: "bold",
                }}
              >
                Total S/ 8738
              </h1>
            </div>
          </div>
        </div> */}
        {/* <PDFViewer width={500} height={600}>
                  <Boleta />
                </PDFViewer> */}
      </View>
    </Page>
  </Document>
);
