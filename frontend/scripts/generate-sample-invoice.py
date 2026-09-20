from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


OUTPUT = Path(__file__).resolve().parents[1] / "docs" / "razorpay-sample-invoice.pdf"


def build_pdf() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="Right",
            parent=styles["Normal"],
            alignment=TA_RIGHT,
            leading=16,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Muted",
            parent=styles["Normal"],
            textColor=colors.HexColor("#5f6b73"),
            leading=16,
        )
    )

    document = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="Specimen Invoice - Meenu Agarwal",
        author="Meenu Agarwal",
    )

    story = [
        Table(
            [
                [
                    Paragraph(
                        "<b><font size='20' color='#1c546d'>MEENU AGARWAL</font></b>"
                        "<br/><font color='#5f6b73'>Educational Counseling</font>",
                        styles["Normal"],
                    ),
                    Paragraph(
                        "<b>SPECIMEN INVOICE</b><br/>Not proof of payment",
                        styles["Right"],
                    ),
                ]
            ],
            colWidths=[105 * mm, 55 * mm],
        ),
        Spacer(1, 10 * mm),
        Table(
            [
                [
                    Paragraph(
                        "<b>From</b><br/>Meenu Agarwal<br/>605, Entice, "
                        "Ambli-Bopal Road<br/>Ahmedabad 380058, Gujarat, India"
                        "<br/>meenu@meenuagarwal.in<br/>+91 97129 24902",
                        styles["Muted"],
                    ),
                    Paragraph(
                        "<b>Sample reference</b><br/>SAMPLE-ONLY"
                        "<br/><br/><b>Issue date</b><br/>To be generated after payment"
                        "<br/><br/><b>Payment status</b><br/>SPECIMEN",
                        styles["Right"],
                    ),
                ]
            ],
            colWidths=[100 * mm, 60 * mm],
        ),
        Spacer(1, 12 * mm),
        Table(
            [
                [
                    Paragraph("<b>Description</b>", styles["Normal"]),
                    Paragraph("<b>Amount</b>", styles["Right"]),
                ],
                [
                    Paragraph(
                        "<b>Complete Counseling Package</b><br/>One-time personal "
                        "study-abroad counseling service. Final price includes all taxes.",
                        styles["Muted"],
                    ),
                    Paragraph("<b>INR 30,000.00</b>", styles["Right"]),
                ],
                [
                    Paragraph("<b>Total</b>", styles["Normal"]),
                    Paragraph("<b>INR 30,000.00</b>", styles["Right"]),
                ],
            ],
            colWidths=[120 * mm, 40 * mm],
            rowHeights=[12 * mm, 28 * mm, 14 * mm],
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e9f2f5")),
                    ("BACKGROUND", (0, -1), (-1, -1), colors.HexColor("#fff0eb")),
                    ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#b9c8ce")),
                    ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#d5dfe3")),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 10),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ]
            ),
        ),
        Spacer(1, 12 * mm),
        Paragraph(
            "<b>Customer details</b><br/>Customer name, email, phone number, "
            "Razorpay payment ID, and verified payment date will appear on the "
            "issued record.",
            styles["Muted"],
        ),
        Spacer(1, 9 * mm),
        Paragraph(
            "This specimen is supplied only for payment-gateway website review. "
            "It is not a tax invoice, receipt, demand for payment, or evidence "
            "that funds were received.",
            ParagraphStyle(
                name="Warning",
                parent=styles["Normal"],
                textColor=colors.HexColor("#c4451d"),
                borderColor=colors.HexColor("#ff7043"),
                borderWidth=1,
                borderPadding=10,
                leading=16,
            ),
        ),
    ]

    document.build(story)


if __name__ == "__main__":
    build_pdf()
