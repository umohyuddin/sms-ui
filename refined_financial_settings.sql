-- Refined Institute Financial Settings Table
-- Consolidates refund policies and financial configurations per academic year.

DROP TABLE IF EXISTS institute_financial_settings;

CREATE TABLE institute_financial_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institute_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,

    -- Currency & Localization
    currency_id INT NOT NULL,            -- FK to currencies table
    language_id BIGINT,                  -- FK to languages table
    locale VARCHAR(10),                  -- e.g., en-PK, en-US

    -- Fee Structure Rules
    fee_frequency VARCHAR(20) NOT NULL,  -- MONTHLY, TERM, ANNUAL
    allow_partial_payments BOOLEAN DEFAULT FALSE,
    late_fee_applicable BOOLEAN DEFAULT FALSE,
    late_fee_type VARCHAR(20),           -- FIXED, PERCENTAGE
    late_fee_value DECIMAL(10,2),

    -- Tax Rules
    tax_applicable BOOLEAN DEFAULT FALSE,
    tax_type_id BIGINT,                  -- FK to tax_types table
    tax_included_in_fee BOOLEAN DEFAULT FALSE,

    -- Refund Rules (Consolidated from refund_policies)
    refunds_allowed BOOLEAN DEFAULT FALSE,
    refund_policy_url VARCHAR(255),      -- link to policy doc
    refund_window_days INT,              -- e.g., 30 days
    max_refund_percentage DECIMAL(5,2),  -- e.g., 50.00%
    max_refund_amount DECIMAL(10,2),

    -- Compliance Flags
    invoice_mandatory BOOLEAN DEFAULT FALSE,
    receipt_mandatory BOOLEAN DEFAULT TRUE,

    -- Status & Audit
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    deleted_at DATETIME,
    deleted_by BIGINT,

    -- Constraints
    FOREIGN KEY (institute_id) REFERENCES institutes(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    FOREIGN KEY (currency_id) REFERENCES currencies(id),
    FOREIGN KEY (language_id) REFERENCES languages(id),
    FOREIGN KEY (tax_type_id) REFERENCES tax_types(id),
    CONSTRAINT uk_institute_academic_year UNIQUE (institute_id, academic_year_id)
);
